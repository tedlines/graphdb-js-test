const Conn = require('./orientdb');

class Board {
    constructor(){
    }

    async getBoards () {
        try {
            let result = await Conn.query(`SELECT *, OUT("allow_to").name AS company_name FROM Boards`, {});
            //console.log("getMembers :", result);
            return result;
        } catch (err) {
            console.log(err);
        }
        return false;      
    }
  
    async addBoard (boardId, name) {
      try {
        let result = await Conn.execute("insert into Boards set id = :boardId, name = :name ", {params: { boardId: boardId, name: name }});
        //console.log(result);
        return result;
      } catch (err) {
        console.log(err);      
      }
      return false;
    }

    async addAllowTo (fromBoardId, toCompanyId) {
        try {
            let result = await Conn.execute(`CREATE EDGE allow_to 
                FROM (SELECT FROM Boards WHERE id = :fromBoardId) 
                TO (SELECT FROM Companies WHERE id = :toCompanyId) `
                , {params: { fromBoardId: fromBoardId, toCompanyId: toCompanyId }});
            console.log(result);
            return result;
        } catch (err) {
            console.log(err);        
        }
        return false;
    }
}

module.exports = new Board();