# Migrating-indexing-pipeline

In order to run the Front-end follow the following steps:
	1. Perform the following command in the both directories: 'npm i'
	2. In the front-end directory run: 'npm run dev'
	3. (optional, in case you want to run it with express) perform the following command in the back-end directory: 'node index.js'
		3.1 (Front-end)in the 'indexer.jsx' file change the following values to your own ip on line 26 and line 45 if needed:
			"http://localhost:5000/sendIndexData" -> "http://127.0.0.1:5000/sendIndexData"
			Ip can be seen after running 'npm run dev'
		3.2 (Back-end) in the index.js file change the following to your own ip:
				app.use(cors({
					origin: 'http://127.0.0.1:5173'
				}));
	4. Login to the front-end using the following credentials:
		username: admin
		password:admin
	5. Choose resource type, source type and period and run the indexer.
	6. Use refresh to check the up to date status.