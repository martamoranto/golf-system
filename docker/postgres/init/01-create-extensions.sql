-- PostgreSQL Extensions for Final Golf SaaS
-- This script runs on first container startup

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
CREATE EXTENSION IF NOT EXISTS "btree_gist";
CREATE EXTENSION IF NOT EXISTS "citext";

-- Enable PostGIS if needed for location features (optional)
-- CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create additional schemas if needed
-- CREATE SCHEMA IF NOT EXISTS "audit";
-- CREATE SCHEMA IF NOT EXISTS "reports";

-- Set up basic configuration
-- ALTER DATABASE final_golf_dev SET log_statement = 'all';
-- ALTER DATABASE final_golf_dev SET log_duration = true;

-- Grant permissions to postgres user
GRANT ALL PRIVILEGES ON DATABASE final_golf_dev TO postgres;

-- Output success message
SELECT 'PostgreSQL extensions initialized successfully' as status;