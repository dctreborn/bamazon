var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "Bamazon"
});


//RPG themed bamazon

function main() {
    inquirer.prompt([{
        type: "list",
        message: "Select an option",
        choices: ["See Items", "Buy Items", "Quit"],
        default: "Buy Items",
        name: "option"
    }]).then(function(user) {

        switch (user.option) {
            case "See Items":
                checkItems();
                break;
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
	connection.query(query, function(err, results){
		if (err) throw err;

		var length = results.length;

		for (var i = 0; i < length; i++) {
			var item = results[i];
			items.push("#" + item.item_id + ": "
				+ item.product_name
				+ ", Price: " + item.price
				+ ", Stock: " + item.stock_quantity);
		}
	});

	//to fix; choices not displaying
	inquirer.prompt([
	{
		type: "list",
		message: "What do you want to buy?",
		choices: items,
		name: "item"
	}
	]).then(function(buy){

	});

}

function checkStock() {

}

function checkItems() {
    var query = "SELECT * FROM products";

    connection.query(query, function(err, results) {
        if (err) throw err;

        for (var i = 0; i < results.length; i++) {
            console.log("Item #" + results[i].item_id + ": " + results[i].product_name);
            console.log("Price: " + results[i].price);
            console.log("Stock: " + results[i].stock_quantity);
            console.log("-----");
        }

        menu();
    });
}

function calcPrice() {

}

main();