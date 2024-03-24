### Default Backend
------
Usage:
- import the repo to your project
- run `npm install`
- use the `database.setupDB()` function to create the database and tables needed for this project
- you are ready to go

Features:
- Database connection (uses mysql databases)
- Models for all Database-Tables in ´@models/[modelType].model.ts´
- Auth-Router provided by default
- User-Router as well
- modular design
  - code split into reuseable modules
  - clean folder structure
  - all configurations in `@config/[configType].config.ts`
