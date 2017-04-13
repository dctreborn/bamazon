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
        if (err) throw err;

        var length = results.length;

        for (var i = 0; i < length; i++) {
            var item = results[i];
            items.push("#" + item.item_id + ": " +
                item.product_name +
                ", Price: " + item.price +
                ", Stock: " + item.stock_quantity);
        }

        buyItem(items);
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
        	var id = item.slice(item.indexOf("#") + 1, item.indexOf(":"));
        	var price = item.slice(item.indexOf("Price") + 8, item.indexOf(", Stock"));

        	//ask amount to buy
        	inquirer.prompt([
        	{
        		type: "input",
        		message: "How many do you want to buy?",
        		name: "bought",
      //   		validate: function (input) {
				  //   // Declare function as asynchronous, and save the done callback 
				  //   var done = this.async();
				 	// console.log("" + typeof input);
				  //   // Do async stuff 
				  //   setTimeout(function () {
				  //     if (typeof input !== 'number') {
				  //       // Pass the return value in the done callback 
				  //       done('You need to provide a number');
				  //       return;
				  //     }
				  //     // Pass the return value in the done callback 
				  //     done(null, true);
				  //   }, 3000);
				  // }
        	}
        	]).then(function(stock){
        		var numBought = Math.max(stock.bought, 0); //cannot have value less than 0
        		
           		checkStock(numBought, id, price); 		

        	});            
        });
}

//if amount to buy <= stock, process order and calc price
//else, display not enough and bring back to main menu
function checkStock(sold, id, price) {

	var query = "SELECT * FROM products WHERE ?";

	connection.query(query, [{item_id: id}], function(err, results) {
		if (err) throw err;

		console.log(results);

		var item = results.product_name;
		var stock = results.stock_quantity;

		if (results.stock_quantity < sold) {
			console.log("Not enough in stock.");
			console.log("Try again later.");
			main();
		} else {
			var query = "UPDATE products SET ? WHERE ?";

			connection.query(query, [{stock_quantity: stock - sold, item_id: id}], function(err, results) {
				//calcuate cost
				var total = sold * price;

				console.log("Bought %s %s for %s gold.", sold, item, total);
			});

		}
	});
}