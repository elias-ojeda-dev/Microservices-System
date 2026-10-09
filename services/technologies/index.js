const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const isIntegerInRange = (value, min = 0) =>
  (typeof value === 'string' || typeof value === 'number') &&
  /^\d+$/.test(String(value)) &&
  Number.isInteger(Number(value)) && Number(value) >= min && Number(value) <= 2147483647;

const app = express();
const PORT = process.env.SERVICE_PORT || 3002;

app.use(express.json());
app.use(cors());

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'reto_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres123'
});

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.post('/v1/api/technologies', async (req, res) => {
  try {
    const { name, sector, description, adoptionLevel } = req.body;

    if (!name || !sector || !adoptionLevel) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['name', 'sector', 'adoptionLevel']
      });
    }

    const validAdoptionLevels = ['emerging', 'growing', 'mature', 'declining'];
    if (!validAdoptionLevels.includes(adoptionLevel)) {
      return res.status(400).json({
        error: 'Invalid adoption level',
        validLevels: validAdoptionLevels
      });
    }

    const query = `
      INSERT INTO technologies (name, sector, description, adoption_level)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [name, sector, description || null, adoptionLevel];
    const result = await pool.query(query, values);

    res.status(201).json({
      message: 'Technology created successfully',
      data: result.rows[0]
    });

    console.log(`Created technology: ${name}`);

  } catch (error) {
    console.error('Error creating technology:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.get('/v1/api/technologies', async (req, res) => {
  try {
    const { name, sector, adoptionLevel, limit = 50, offset = 0 } = req.query;

    if (!isIntegerInRange(limit) || !isIntegerInRange(offset)) {
      return res.status(400).json({
        error: 'Invalid pagination. limit and offset must be integers between 0 and 2147483647'
      });
    }

    let query = 'SELECT * FROM technologies WHERE 1=1';
    const values = [];
    let paramCounter = 1;

    if (name) {
      query += ` AND name ILIKE $${paramCounter}`;
      values.push(`%${name}%`);
      paramCounter++;
    }

    if (sector) {
      query += ` AND sector ILIKE $${paramCounter}`;
      values.push(`%${sector}%`);
      paramCounter++;
    }

    if (adoptionLevel) {
      query += ` AND adoption_level = $${paramCounter}`;
      values.push(adoptionLevel);
      paramCounter++;
    }

    query += ` ORDER BY created_at DESC`;
    query += ` LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
    values.push(Number(limit), Number(offset));

    const result = await pool.query(query, values);

    let countQuery = 'SELECT COUNT(*) FROM technologies WHERE 1=1';
    const countValues = [];
    paramCounter = 1;

    if (name) {
      countQuery += ` AND name ILIKE $${paramCounter}`;
      countValues.push(`%${name}%`);
      paramCounter++;
    }

    if (sector) {
      countQuery += ` AND sector ILIKE $${paramCounter}`;
      countValues.push(`%${sector}%`);
      paramCounter++;
    }

    if (adoptionLevel) {
      countQuery += ` AND adoption_level = $${paramCounter}`;
      countValues.push(adoptionLevel);
      paramCounter++;
    }

    const countResult = await pool.query(countQuery, countValues);
    const totalCount = parseInt(countResult.rows[0].count);

    res.json({
      data: result.rows,
      pagination: {
        total: totalCount,
        limit: Number(limit),
        offset: Number(offset),
        hasMore: Number(offset) + result.rows.length < totalCount
      }
    });

    console.log(`Retrieved ${result.rows.length} technologies`);

  } catch (error) {
    console.error('Error reading technologies:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.get('/v1/api/technologies/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!isIntegerInRange(id, 1)) {
      return res.status(400).json({
        error: 'Invalid ID format'
      });
    }

    const query = 'SELECT * FROM technologies WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Technology not found'
      });
    }

    res.json({
      data: result.rows[0]
    });

    console.log(`Retrieved technology with ID: ${id}`);

  } catch (error) {
    console.error('Error reading technology:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.put('/v1/api/technologies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sector, description, adoptionLevel } = req.body;

    if (!isIntegerInRange(id, 1)) {
      return res.status(400).json({
        error: 'Invalid ID format'
      });
    }

    const checkQuery = 'SELECT * FROM technologies WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Technology not found'
      });
    }

    const updates = [];
    const values = [];
    let paramCounter = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCounter}`);
      values.push(name);
      paramCounter++;
    }

    if (sector !== undefined) {
      updates.push(`sector = $${paramCounter}`);
      values.push(sector);
      paramCounter++;
    }

    if (description !== undefined) {
      updates.push(`description = $${paramCounter}`);
      values.push(description);
      paramCounter++;
    }

    if (adoptionLevel !== undefined) {
      const validLevels = ['emerging', 'growing', 'mature', 'declining'];
      if (!validLevels.includes(adoptionLevel)) {
        return res.status(400).json({
          error: 'Invalid adoption level',
          validLevels: validLevels
        });
      }
      updates.push(`adoption_level = $${paramCounter}`);
      values.push(adoptionLevel);
      paramCounter++;
    }

    if (updates.length === 0) {
      return res.status(400).json({
        error: 'No valid fields to update'
      });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);

    values.push(id);

    const updateQuery = `
      UPDATE technologies
      SET ${updates.join(', ')}
      WHERE id = $${paramCounter}
      RETURNING *
    `;

    const result = await pool.query(updateQuery, values);

    res.json({
      message: 'Technology updated successfully',
      data: result.rows[0]
    });

    console.log(`Updated technology with ID: ${id}`);

  } catch (error) {
    console.error('Error updating technology:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.delete('/v1/api/technologies/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!isIntegerInRange(id, 1)) {
      return res.status(400).json({
        error: 'Invalid ID format'
      });
    }

    const checkQuery = 'SELECT * FROM technologies WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Technology not found'
      });
    }

    const technologyData = checkResult.rows[0];

    const deleteQuery = 'DELETE FROM technologies WHERE id = $1';
    await pool.query(deleteQuery, [id]);

    res.status(200).json({
      message: 'Technology deleted successfully',
      data: {
        id: technologyData.id,
        name: technologyData.name
      }
    });

    console.log(`Deleted technology with ID: ${id}, Name: ${technologyData.name}`);

  } catch (error) {
    console.error('Error deleting technology:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`Technologies Service running on port ${PORT}`);
  console.log(`Database: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
});
