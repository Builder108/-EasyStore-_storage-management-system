import { supabase } from "../supabaseClient.js";

/* =========================
   SIGN UP
========================= */
export const signUp = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // ✅ DO NOT INSERT INTO public.users
    // Supabase trigger already handles it

    res.json({
      message: "Signup successful",
      user: data.user,
      session: data.session,
    });
  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
};

/* =========================
   LOGIN
========================= */
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};

/* =========================
   CURRENT USER
========================= */
export const getMe = async (req, res) => {
  res.json(req.user);
};
