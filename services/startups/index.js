const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const isIntegerInRange = (value, min = 0) =>
  (typeof value === 'string' || typeof value === 'number') &&
  /^\d+$/.test(String(value)) &&
  Number.isInteger(Number(value)) && Number(value) >= min && Number(value) <= 2147483647;

const isValidDate = value => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith('0000')) {
    return false;
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const app = express();
const PORT = process.env.SERVICE_PORT || 3001;

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

app.post('/v1/api/startups', async (req, res) => {
  try {
    const { name, foundedAt, location, category, fundingAmount } = req.body;

    if (!name || !foundedAt || !location || !category) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['name', 'foundedAt', 'location', 'category']
      });
    }

    if (!isValidDate(foundedAt)) {
      return res.status(400).json({
        error: 'Invalid date. Use a valid calendar date in YYYY-MM-DD format'
      });
    }

    const funding = fundingAmount || 0;
    if (isNaN(funding) || funding < 0) {
      return res.status(400).json({
        error: 'Invalid funding amount'
      });
    }

    const query = `
      INSERT INTO startups (name, founded_at, location, category, funding_amount)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [name, foundedAt, location, category, funding];
    const result = await pool.query(query, values);

    res.status(201).json({
      message: 'Startup created successfully',
      data: result.rows[0]
    });

    console.log(`Created startup: ${name}`);

  } catch (error) {
    console.error('Error creating startup:', error);

    if (error.code === '23505') {
      return res.status(409).json({
        error: 'Startup with this name already exists'
      });
    }

    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.get('/v1/api/startups', async (req, res) => {
  try {
    const { name, category, location, limit = 50, offset = 0 } = req.query;

    if (!isIntegerInRange(limit) || !isIntegerInRange(offset)) {
      return res.status(400).json({
        error: 'Invalid pagination. limit and offset must be integers between 0 and 2147483647'
      });
    }

    let query = 'SELECT * FROM startups WHERE 1=1';
    const values = [];
    let paramCounter = 1;

    if (name) {
      query += ` AND name ILIKE $${paramCounter}`;
      values.push(`%${name}%`);
      paramCounter++;
    }

    if (category) {
      query += ` AND category ILIKE $${paramCounter}`;
      values.push(`%${category}%`);
      paramCounter++;
    }

    if (location) {
      query += ` AND location ILIKE $${paramCounter}`;
      values.push(`%${location}%`);
      paramCounter++;
    }

    query += ` ORDER BY created_at DESC`;
    query += ` LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
    values.push(Number(limit), Number(offset));

    const result = await pool.query(query, values);

    let countQuery = 'SELECT COUNT(*) FROM startups WHERE 1=1';
    const countValues = [];
    paramCounter = 1;

    if (name) {
      countQuery += ` AND name ILIKE $${paramCounter}`;
      countValues.push(`%${name}%`);
      paramCounter++;
    }

    if (category) {
      countQuery += ` AND category ILIKE $${paramCounter}`;
      countValues.push(`%${category}%`);
      paramCounter++;
    }

    if (location) {
      countQuery += ` AND location ILIKE $${paramCounter}`;
      countValues.push(`%${location}%`);
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

    console.log(`Retrieved ${result.rows.length} startups`);

  } catch (error) {
    console.error('Error reading startups:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.get('/v1/api/startups/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!isIntegerInRange(id, 1)) {
      return res.status(400).json({
        error: 'Invalid ID format'
      });
    }

    const query = 'SELECT * FROM startups WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Startup not found'
      });
    }

    res.json({
      data: result.rows[0]
    });

    console.log(`Retrieved startup with ID: ${id}`);

  } catch (error) {
    console.error('Error reading startup:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.put('/v1/api/startups/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, foundedAt, location, category, fundingAmount } = req.body;

    if (!isIntegerInRange(id, 1)) {
      return res.status(400).json({
        error: 'Invalid ID format'
      });
    }

    const checkQuery = 'SELECT * FROM startups WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Startup not found'
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

    if (foundedAt !== undefined) {
      if (!isValidDate(foundedAt)) {
        return res.status(400).json({
          error: 'Invalid date. Use a valid calendar date in YYYY-MM-DD format'
        });
      }
      updates.push(`founded_at = $${paramCounter}`);
      values.push(foundedAt);
      paramCounter++;
    }

    if (location !== undefined) {
      updates.push(`location = $${paramCounter}`);
      values.push(location);
      paramCounter++;
    }

    if (category !== undefined) {
      updates.push(`category = $${paramCounter}`);
      values.push(category);
      paramCounter++;
    }

    if (fundingAmount !== undefined) {
      if (isNaN(fundingAmount) || fundingAmount < 0) {
        return res.status(400).json({
          error: 'Invalid funding amount'
        });
      }
      updates.push(`funding_amount = $${paramCounter}`);
      values.push(fundingAmount);
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
      UPDATE startups
      SET ${updates.join(', ')}
      WHERE id = $${paramCounter}
      RETURNING *
    `;

    const result = await pool.query(updateQuery, values);

    res.json({
      message: 'Startup updated successfully',
      data: result.rows[0]
    });

    console.log(`Updated startup with ID: ${id}`);

  } catch (error) {
    console.error('Error updating startup:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.delete('/v1/api/startups/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!isIntegerInRange(id, 1)) {
      return res.status(400).json({
        error: 'Invalid ID format'
      });
    }

    const checkQuery = 'SELECT * FROM startups WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Startup not found'
      });
    }

    const startupData = checkResult.rows[0];

    const deleteQuery = 'DELETE FROM startups WHERE id = $1';
    await pool.query(deleteQuery, [id]);

    res.status(200).json({
      message: 'Startup deleted successfully',
      data: {
        id: startupData.id,
        name: startupData.name
      }
    });

    console.log(`Deleted startup with ID: ${id}, Name: ${startupData.name}`);

  } catch (error) {
    console.error('Error deleting startup:', error);
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
  console.log(`Startups Service running on port ${PORT}`);
  console.log(`Database: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
});
