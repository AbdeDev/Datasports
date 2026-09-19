import app from "@adonisjs/core/services/app";
import { defineConfig } from "@adonisjs/lucid";
import env from "#start/env";

const dbConfig = defineConfig({
  /**
   * Default connection used for all queries.
   */
  connection: "pg",

  connections: {
    /**
     * PostgreSQL connection. Render's default network has no IPv6 egress,
     * while Supabase's direct-connection host resolves IPv6-only — so
     * production points DATABASE_URL at Supabase's Session pooler (IPv4)
     * instead. Local dev/CI can keep using the direct connection.
     */
    pg: {
      client: "pg",

      connection: env.get("DATABASE_URL"),

      /**
       * Lucid/Knex manages its own pool of connections against whichever
       * host DATABASE_URL points to. Kept small and explicit rather than
       * left to the driver default — this is a low-traffic internal tool
       * (a few dozen scouts/admins, not high-frequency polling), so a
       * handful of connections comfortably covers concurrent requests
       * without pressuring Supabase's own connection limit.
       */
      pool: {
        min: 2,
        max: 10,
      },

      migrations: {
        /**
         * Sort migration files naturally by filename.
         */
        naturalSort: true,

        /**
         * Paths containing migration files.
         */
        paths: ["database/migrations"],
      },

      schemaGeneration: {
        /**
         * Enable schema generation from Lucid models.
         */
        enabled: true,

        /**
         * Custom schema rules file paths.
         */
        rulesPaths: ["./database/schema_rules.js"],
      },

      debug: app.inDev,
    },

    /**
     * MySQL / MariaDB connection.
     * Install package to switch: npm install mysql2
     */
    // mysql: {
    //   client: 'mysql2',
    //   connection: {
    //     host: env.get('DB_HOST'),
    //     port: env.get('DB_PORT'),
    //     user: env.get('DB_USER'),
    //     password: env.get('DB_PASSWORD'),
    //     database: env.get('DB_DATABASE'),
    //   },
    //   migrations: {
    //     naturalSort: true,
    //     paths: ['database/migrations'],
    //   },
    //   debug: app.inDev,
    // },

    /**
     * Microsoft SQL Server connection.
     * Install package to switch: npm install tedious
     */
    // mssql: {
    //   client: 'mssql',
    //   connection: {
    //     server: env.get('DB_HOST'),
    //     port: env.get('DB_PORT'),
    //     user: env.get('DB_USER'),
    //     password: env.get('DB_PASSWORD'),
    //     database: env.get('DB_DATABASE'),
    //   },
    //   migrations: {
    //     naturalSort: true,
    //     paths: ['database/migrations'],
    //   },
    //   debug: app.inDev,
    // },

    /**
     * libSQL (Turso) connection.
     * Install package to switch: npm install @libsql/client
     */
    // libsql: {
    //   client: 'libsql',
    //   connection: {
    //     url: env.get('LIBSQL_URL'),
    //     authToken: env.get('LIBSQL_AUTH_TOKEN'),
    //   },
    //   useNullAsDefault: true,
    //   migrations: {
    //     naturalSort: true,
    //     paths: ['database/migrations'],
    //   },
    //   debug: app.inDev,
    // },
  },
});

export default dbConfig;
