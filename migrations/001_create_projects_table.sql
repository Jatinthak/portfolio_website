```sql
-- Create the projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL
);

-- Create an index on the name column for efficient querying
CREATE INDEX IF NOT EXISTS idx_projects_name ON projects (name);

-- Create a unique constraint on the name column to prevent duplicates
ALTER TABLE projects ADD CONSTRAINT unique_name UNIQUE (name);

-- Insert a default project if the table is empty
INSERT INTO projects (id, name, description)
SELECT '00000000-0000-0000-0000-000000000001', 'Default Project', 'This is a default project'
WHERE NOT EXISTS (SELECT 1 FROM projects);

-- Commit the changes
COMMIT;
```