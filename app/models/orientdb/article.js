const Conn = require('./orientdb');

class Article {
    constructor(){
    }

    async getArticles () {
        try {
            let result = await Conn.query(`SELECT *, OUT("belong_to").name AS board_name, OUT("written_by").name AS member_name FROM Articles`, {});
            
            return result;
        } catch (err) {
            console.log(err);
        }
        return false;      
    }

    async getArticlesByBoardId (boardId) {
        try {
            let result = await Conn.query(`
                SELECT *, OUT("belong_to").name AS board_name, OUT("written_by").name AS member_name 
                FROM Articles 
                LET $board_ids = OUT("belong_to").id
                WHERE $board_ids.indexOf(:boardId) > -1 `
                , {params: {boardId: boardId}});                
            return result;
        } catch (err) {
            console.log(err);
        }
        return false;      
    }

    async getArticle (articleId) {
        try {
            let result = await Conn.query(`
                SELECT *, OUT("belong_to").name AS board_name, OUT("written_by").name AS member_name 
                FROM Articles                 
                WHERE id = :articleId `
                , {params: {articleId: articleId}});                
            return result;
        } catch (err) {
            console.log(err);
        }
        return false;      
    }

    async getArticlesReadByCompanyMembers (companyId) {
        try {
            let result = await Conn.query(`
                SELECT *, out("read_by").name AS member_name, out("belong_to").name AS board_name
                FROM (
                    TRAVERSE IN("work_for").IN("read_by") FROM (SELECT FROM Companies WHERE id = :companyId)
                    MAXDEPTH 1 STRATEGY BREADTH_FIRST
                ) WHERE @class = "Articles" `
                , {params: {companyId: companyId}});                
            return result;
        } catch (err) {
            console.log(err);
        }
        return false;      
    }

    async addArticle (articleId, title, content) {
      try {
            let result = await Conn.execute(`insert into Articles SET 
                id = :articleId, title = :title, content = :content `
                , {params: { articleId: articleId, title: title, content: content }});
            console.log(result);
            return result;
      } catch (err) {
            console.log(err);      
      }
      return false;
    }
  
    async addBelongTo (fromArticleId, toBoardId) {
        try {
            let result = await Conn.execute(`CREATE EDGE belong_to 
                FROM (SELECT FROM Articles WHERE id = :fromArticleId)
                TO (SELECT FROM Boards WHERE id = :toBoardId) `
                , {params: { fromArticleId: fromArticleId, toBoardId: toBoardId }});
            console.log(result);
            return result;
        } catch (err) {
            console.log(err);
        }
        return false;
    }
  
    async addWrittenBy (fromArticleId, toMemberId) {
        try {
            let result = await Conn.execute(`CREATE EDGE written_by 
                FROM (SELECT FROM Articles WHERE id = :fromArticleId)
                TO (SELECT FROM Members WHERE id = :toMemberId) `
                , {params: { fromArticleId: fromArticleId, toMemberId: toMemberId}});
            console.log(result);
            return result;
        } catch (err) {
            console.log(err);
        }
        return false;
    }
  
    async addReadBy (fromArticleId, toMemberId) {
      try {
          let result = await Conn.execute(`CREATE EDGE read_by 
              FROM (SELECT FROM Articles WHERE id = :fromArticleId) 
              TO (SELECT FROM Members WHERE id = :toMemberId) `
              , {params: { fromArticleId: fromArticleId, toMemberId: toMemberId }});
          console.log(result);
          return result;
        } catch (err) {
          console.log(err);        
        }
      return false;
    }
  
    async addLikedBy (fromMemberId, toArticleId) {
      try {
          let result = await Conn.execute(`CREATE EDGE liked_by 
              FROM (SELECT FROM Members WHERE id = :fromMemberId) 
              TO (SELECT FROM Articles WHERE id = :toArticleId) `
              , {params: { fromMemberId: fromMemberId, toArticleId: toArticleId }});
          console.log(result);
          return result;
        } catch (err) {
          console.log(err);        
        }
      return false;      
    }
  }
  
  module.exports = new Article();