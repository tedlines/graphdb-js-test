const OrientDBClient = require("orientjs").OrientDBClient;

class DbFactory {
  constructor() {
    OrientDBClient.connect({
      host: "orientdb",
      port: 2424
    }).then(client => {
      client.sessions({ name: "graphdb_test", username: "root", password: "1234qwer", pool: { max: 10} })
      .then(pool => { 
        this.sessionPool = pool;
      });
    });
  }

  async execute(query, qparams) {
    const session = await this.sessionPool.acquire();
    console.log("========= execute Query :", query);
    console.log("========= qparams :", qparams);
    let result = await session.command(query, qparams).all();
    //console.log("========= result :", result);  
    session.close();
 
    return result;
  }

  async query (query, qparams) { 
    const session = await this.sessionPool.acquire();
    console.log("========= query Query :", query);
    console.log("========= qparams :", qparams);
    let result = await session.command(query, qparams).all();
    //console.log("========= result :", result);  
    session.close();
 
    return result;
  }
}

module.exports = new DbFactory();