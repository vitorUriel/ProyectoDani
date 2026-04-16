require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.DB_SUPABASE_URL;
const supabaseKey = process.env.DB_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Faltan las variables de entorno de Supabase (DB_SUPABASE_URL o DB_SUPABASE_KEY)');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;