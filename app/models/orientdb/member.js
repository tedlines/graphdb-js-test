const Conn = require('./orientdb');

class Member {
    constructor(){
    }

    async getMembers () {
        try {
            let result = await Conn.query(`
                SELECT *, OUT("work_for").name AS company_name 
                FROM Members`
                , {});
            console.log("getMembers :", result);
            return result;
        } catch (err) {
            console.log(err);
        }
        return false;      
    }
  
    async getMembersByCompanyId (companyId) {
        try {
            let result = await Conn.query(`
                SELECT *, OUT("work_for").name AS company_name 
                FROM Members LET $company_ids = OUT("work_for").id
                WHERE $company_ids.indexOf(:companyId) > -1 `
                , {params: {companyId: companyId}});
            console.log("getMembersByCompanyId :", result);
            return result;
        } catch (err) {
            console.log(err);
        }
        return false;      
    }

    async addMember (memberId, name, age) {
        try {
            let result = await Conn.execute("insert into Members set id = :memberId, name = :name, age = :age ", {params: { memberId: memberId, name: name, age: age }});
            console.log(result);
            return result;
        } catch (err) {
            console.log(err);
        }
        return false;
    }

    async addWorkFor (fromMemberId, toCompanyId) {
        try {
            let result = await Conn.execute(`CREATE EDGE work_for 
                FROM (SELECT FROM Members WHERE id = :fromMemberId) 
                TO (SELECT FROM Companies WHERE id = :toCompanyId) `
                , {params: { fromMemberId: fromMemberId, toCompanyId: toCompanyId }});
            console.log(result);
            return result;
        } catch (err) {
            console.log(err);        
        }
        return false;
    }
}

module.exports = new Member();