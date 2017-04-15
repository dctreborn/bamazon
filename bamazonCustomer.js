var inquirer = require("inquirer");
var mysql = require("mysql");
var connection;

inquirer.prompt([{
    message: "Enter database password",
    name: "password",
    type: "password"
}]).then(function(db) {

    connection = mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: db.password,
        database: "Bamazon"
    });

    main();
});

//RPG themed bamazon

function main() {
    inquirer.prompt([{
        type: "list",
        message: "Select an option",
        choices: ["Buy Items", "Quit"],
        name: "option"
    }]).then(function(user) {

        switch (user.option) {
            case "Buy Items":
                menu();
                break;
            default:
                console.log("Goodbye.");
        }

    });
}

function menu() {
    var query = "SELECT * FROM products";
    var items = [];

    //build item array with prices and stock
    connection.query(query, function(err, results) {
        if (err) {
            console.log("-----");
            console.log("Incorrect database password. Please try again.");
            console.log("-----");
        } else {

            var length = results.length;

            for (var i = 0; i < length; i++) {
                var item = results[i];
                items.push("#" + item.item_id + ": " +
                    item.product_name +
                    ", Price: " + item.price +
                    ", Stock: " + item.stock_quantity);
            }

            buyItem(items);
        }
    });
}

function buyItem(inventory) {

    inquirer.prompt([{
        type: "list",
        message: "What do you want to buy?",
        choices: inventory,
        name: "item"
    }]).then(function(buy) {
        //slice item number from given string and UPDATE products SET stock_quantity = stock_quantity - bought WHERE item_id = id
        var item = buy.item;
        var id = parseInt(item.slice(item.indexOf("#") + 1, item.indexOf(":")));
        var price = parseInt(item.slice(item.indexOf("Price") + 7, item.indexOf(", Stock")));

        //ask amount to buy
        inquirer.prompt([{
            type: "input",
            message: "How many do you want to buy?",
            validate: function(input) {
                // Declare function as asynchronous, and save the done callback 
                var done = this.async();

                // Do async stuff 
                setTimeout(function() {
                    if (isNaN(input)) {
                        // Pass the return value in the done callback 
                        done('You need to provide a number');
                        return;
                    }
                    // Pass the return value in the done callback 
                    done(null, true);
                }, 3000);
            },
            name: "bought"
        }]).then(function(stock) {
            var numBought = Math.max(stock.bought, 0); //cannot have value less than 0

            checkStock(numBought, id, price);

        });
    });
}

//if amount to buy <= stock, process order and calc price
//else, display not enough and bring back to main menu
function checkStock(sold, id, price) {
    var query = "SELECT * FROM products WHERE item_id = ?";

    connection.query(query, [id], function(err, results) {
        if (err) throw err;

        var item = results[0].product_name;
        var stock = results[0].stock_quantity;

        if (stock < sold) {
            console.log("-----");
            console.log("Not enough in stock.");
            console.log("Try again later.");
            console.log("-----");
            main();
        } else {
            var query = "UPDATE products SET stock_quantity = ? WHERE item_id = ?";

            connection.query(query, [(stock - sold), id], function(err, results) {
                //calcuate cost
                var total = sold * price;

                console.log("-----");
                console.log("Bought %s %s for %s gold.", sold, item, total);
                console.log("-----");

                main()
            });

        }
    });
}