# NC News Seeding

### Configure environment variables

Create two `.env` files in the root of your project:

#### `.env.development`

```env
PGDATABASE=nc_news
```

#### `.env.test`

```env
PGDATABASE=nc_news_test
```

✅ Important: Ensure `.env.\*` files are listed in your .gitignore so they are not commited to GitHub.
