import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = process.env.PORT || 4000;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization token.' });
  }

  const token = authHeader.slice(7);
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }

  req.user = data.user;
  next();
};

app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'image-splitter-backend' });
});

app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const normalizedEmail = email.toLowerCase();
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
  });

  if (signUpError) {
    return res.status(400).json({ error: signUpError.message });
  }

  const user = signUpData.user;
  let token = signUpData.session?.access_token ?? null;

  if (!token) {
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (loginError || !loginData.session) {
      return res.status(201).json({
        user: { id: user?.id ?? null, email: user?.email ?? normalizedEmail },
        token: null,
        message: 'Check your email to confirm your account before logging in.',
      });
    }

    token = loginData.session.access_token;
    return res.status(201).json({
      user: { id: loginData.user?.id ?? null, email: loginData.user?.email ?? normalizedEmail },
      token,
    });
  }

  return res.status(201).json({
    user: { id: user?.id ?? null, email: user?.email ?? normalizedEmail },
    token,
  });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const normalizedEmail = email.toLowerCase();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (error || !data.session || !data.user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  return res.json({
    user: { id: data.user.id, email: data.user.email },
    token: data.session.access_token,
  });
});

app.get('/api/auth/me', authenticate, (req, res) => {
  return res.json({ user: { id: req.user.id, email: req.user.email } });
});

app.get('/api/users', async (req, res) => {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const users = data.users.map((user) => ({
    id: user.id,
    email: user.email,
    createdAt: user.created_at,
  }));

  res.json({ users });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
