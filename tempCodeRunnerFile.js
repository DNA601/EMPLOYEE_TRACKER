
            const sql = `INSERT INTO department ?`
            db.query(sql, {
                    name: answer.name
                },
                function(err, res) {
                    if (err) throw err;

                    console.table(res);
                    console.log(res.insertedRows + " WOW! New department added ");

                    optionStart();
                });
        });
}





optionStart()