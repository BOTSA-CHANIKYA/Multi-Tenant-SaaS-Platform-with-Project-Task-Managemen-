const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/db');      // <- corrected path
const { generateToken } = require('../utils/jwt');

const router = express.Router();

router.get('/ping', (req, res) => {
  res.json({ ok: true });
});
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0)
      return res.status(401).json({ message: 'Login failed' });

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)
      return res.status(401).json({ message: 'Login failed' });

    const token = generateToken({
      userId: user.id,
      tenantId: user.tenant_id,
      role: user.role,
    });

    res.json({
      success: true,
      token,
      user: {
        email: user.email,
        role: user.role,
        tenantId: user.tenant_id,
      },
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// TEMP: debug bcrypt – remove after testing
router.post('/debug-bcrypt', async (req, res) => {
  const { password } = req.body;
  const hash = '$2b$10$eIXQh0TefbCE9H1ixKfZReF1A5D0k/5LxIh9W2H1U4q1S3U4vX6tW'; // admin@saas.com hash

  try {
    const ok = await bcrypt.compare(password, hash);
    return res.json({ ok });
  } catch (e) {
    console.error('debug-bcrypt error', e);
    return res.status(500).json({ message: 'error' });
  }
});

module.exports = router;
