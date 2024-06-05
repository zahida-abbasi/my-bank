import { faker } from "@faker-js/faker";
import chalk from "chalk";
import inquirer from "inquirer";
// customer class
class Customer {
    firstName;
    lastName;
    age;
    gender;
    mobileNo;
    accountNo;
    constructor(fName, lName, age, gender, mobileNo, accountNo) {
        this.firstName = fName;
        this.lastName = lName;
        this.age = age;
        this.gender = gender;
        this.mobileNo = mobileNo;
        this.accountNo = accountNo;
    }
}
class Bank {
    customer = [];
    account = [];
    // creat a function for adding customer
    addCustomer(obj) {
        this.customer.push(obj);
    }
    // add account number
    addAccountNo(obj) {
        this.account.push(obj);
    }
    transaction(accObj) {
        let newAccounts = this.account.filter(acc => acc.accountNum !== accObj.accountNum);
        this.account = [...newAccounts, accObj];
    }
}
let myBank = new Bank();
// customer creat
for (let i = 1; i <= 3; i++) {
    let fName = faker.person.firstName("male");
    let lName = faker.person.lastName();
    let num = parseInt(faker.string.numeric(11)); // Use faker.string.numeric() to generate a 11-digit number
    // let num = parseInt(faker.phone.number("3##########"));
    const cus = new Customer(fName, lName, 25 * i, "male", num, 1000 + i);
    myBank.addCustomer(cus);
    myBank.addAccountNo({ accountNum: cus.accountNo, balance: 1000 * i });
}
// Bank functionality
async function BankService(bank) {
    do {
        let service = await inquirer.prompt({
            type: "list",
            name: "select",
            message: "please select the service.",
            choices: ["View Balance", "Cash Withdraw", "Cash Deposit", "Exit"],
        });
        //View Balance
        if (service.select == "View Balance") {
            let res = await inquirer.prompt({
                type: "input",
                name: "number",
                message: "Please Enter Your Account Number:"
            });
            let account = myBank.account.find((acc) => acc.accountNum == res.number);
            if (!account) {
                console.log(chalk.red.bold("Invalid Account Number"));
            }
            ;
            if (account) {
                let name = myBank.customer.find((item) => item.accountNo == account.accountNum);
                console.log(`Dear ${chalk.green(name?.firstName)} ${chalk.green(name?.lastName)} Your Account Balance Is ${chalk.bold.yellow(`$${account.balance}`)}`);
            }
        }
        //cash withdraw
        if (service.select == "Cash Withdraw") {
            let res = await inquirer.prompt({
                type: "input",
                name: "number",
                message: "Please Enter Your Account Number:"
            });
            let account = myBank.account.find((acc) => acc.accountNum == res.number);
            if (!account) {
                console.log(chalk.red.bold("Invalid Account Number"));
            }
            ;
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    message: "Please Enter Your Amount:",
                    name: "rupee",
                });
                if (ans.rupee > account.balance) {
                    console.log(chalk.red.bold("Insuficient Balance"));
                }
                let newBalance = account.balance - ans.rupee;
                // transaction method call
                bank.transaction({ accountNum: account.accountNum, balance: newBalance });
                console.log(chalk.green.bold("Withdrawal Successful. Your Remaining Balance Is ") + chalk.yellow.bold(`$${newBalance}`));
            }
        }
        //cash deposit
        if (service.select == "Cash Deposit") {
            let res = await inquirer.prompt({
                type: "input",
                name: "number",
                message: "Please Enter Your Account Number:"
            });
            let account = myBank.account.find((acc) => acc.accountNum == res.number);
            if (!account) {
                console.log(chalk.red.bold("Invalid Account Number"));
            }
            ;
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    message: "Please Enter Your Amount:",
                    name: "rupee",
                });
                let newBalance = account.balance + ans.rupee;
                // tarnsaction method call
                bank.transaction({ accountNum: account.accountNum, balance: newBalance });
                console.log(chalk.green.bold("Deposit Duccessful. Your Current Balance Is ") + chalk.yellow.bold(`$${newBalance}`));
            }
        }
        // Exit
        if (service.select == "Exit") {
            return;
        }
    } while (true);
}
BankService(myBank);
