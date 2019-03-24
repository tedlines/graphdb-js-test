const Conn = require('./orientdb');

class Company {
    constructor(){
    }

    async getCompanies () {
        try {
          let result = await Conn.query(`SELECT *, IN("allow_to").name AS board_name FROM Companies`, {});
          //console.log("getMembers :", result);
          return result;
        } catch (err) {
          console.log(err);
        }
        return false;      
      }
  
    async addCompany (companyId, name) {
      try {
        let result = await Conn.execute("insert into Companies set id = :companyId, name = :name ", {params: { companyId: companyId, name: name }});
        //console.log(result);
        return result;
      } catch (err) {
        console.log(err);      
      }
      return false;
    }
  
  }
  
  module.exports = new Company();