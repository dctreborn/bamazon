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
                buy();
                break;
            default:
                console.log("Goodbye.");
        }

    });
}

function buy() {
    var query = "SELECT * FROM products";
    var items = [];

    //build item array with prices and stock
    connection.query(query, function(err, results) {
        if (err) throw err;

        var length = results.length;

        for (var i = 0; i < length; i++) {
            var item = results[i];
            items.push("#" + item.item_id + ": " +
                item.product_name +
                ", Price: " + item.price +
                ", Stock: " + item.stock_quantity);
        }

        inquirer.prompt([{
            type: "list",
            message: "What do you want to buy?",
            choices: items,
            name: "item"
        }]).then(function(buy) {
        	//ask amount to buy
            //if amount to buy <= stock, process order and calc price
            //else, display not enough and bring back to main menu
            //slice item number from given string and UPDATE products SET stock_quantity = stock_quantity - bought WHERE item_id = id
            console.log(buy);
        });
    });

}

function checkStock() {

}

function calcPrice() {

}