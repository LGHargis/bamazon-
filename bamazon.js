var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Terminalgirl16",
    database: "bamazon_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Bamazon Store!!!!");
    getProducts()
    //this will show my customers their choices//
});
function getProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + "|" + res[i].product_name + "|" + res[i].department_name + "|" + res[i].price + "|" + res[i].stockQuantity);
        }
        console.log("------------------------");
        makePurchase();
    });
}
function makePurchase() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "choice",
                type: "rawlist",
                choices: function () {
                    let choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].product_name);

                    }
                    return choiceArray;
                },
                message: "What item number do you want to buy?"
            },
            {
                name: "buy",
                type: "rawlist",
                message: "How many would you like to buy?",
                choices: ["1", "2", "3", "4", "5"]
            }
        ])
            .then(function (answer) {
                // get the info of the item in choice answers
                console.log(answer);
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].product_name === answer.choice) {
                        chosenItem = results[i];
                    }

                }
                console.log(chosenItem);
                // determine if enough in stock
                if (parseInt(chosenItem.stockQuantity) > parseInt(answer.buy)) {
                    // stock quanitty high enough, so update db, let the user know.
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stockQuantity: (chosenItem.stockQuantity - answer.buy)
                            },
                            {
                                item_id: chosenItem.item_id
                            }
                        ],
                        function (error) {
                            if (error) throw err;
                            console.log("Purchase made successfully!");
                        }
                    );
                }
                else {
                    // stock wasn't high enough, so apologize and start over
                    console.log("Out of Stock");
                }
            });
    });
}



