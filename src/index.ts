const inquirer = require('inquirer');
const consola = require('consola');

enum Variant {
    Success = 'success',
    Error = 'error',
    Info = 'info'
}

class Message {
    private content: string;

    constructor(content: string) {
        this.content = content;
    }

    public show(): void {
        consola.log(this.content)
    }

    public capitalize(): void {
        this.content = this.content.charAt(0).toUpperCase() + this.content.substring(1).toLowerCase();
    }

    public toUpperCase(): void {
        this.content = this.content.toUpperCase();
    }

    public toLowerCase(): void {
        this.content = this.content.toLowerCase();
    }

    public static showColorized(variant: Variant, text: string): void {
        switch (variant) {
            case Variant.Success:
                consola.success(text);
                break;
            case Variant.Error:
                consola.error(text);
                break;
            case Variant.Info:
                consola.info(text);
                break;
        }
    }
}

interface User {
    name: string,
    age: number
}

class UserData {
    data: User[] = [];

    public showAll(): void {
        if (this.data.length > 0) {
            Message.showColorized(Variant.Info, "ℹ Users data");
            console.table(this.data);
        } else {
            Message.showColorized(Variant.Info, "ℹ No data...");
        }
    }

    public add(user: User): void {
        const isValidUser = typeof user.name === 'string' && user.name.length > 0 && typeof user.age === 'number' && user.age > 0;

        if (isValidUser) {
            this.data.push(user);
            Message.showColorized(Variant.Success, "User has been successfully added!");
        } else {
            Message.showColorized(Variant.Error, "Wrong data!");
        }
    }

    public remove(username: string): void {
        const index = this.data.findIndex(user => user.name === username)
        if (index !== -1) {
            this.data.splice(index, 1)
            Message.showColorized(Variant.Success, "User deleted")
        } else {
            Message.showColorized(Variant.Error, "User not found")
        }
    }
}

const users = new UserData();
console.log("\n");
console.info("???? Welcome to the UsersApp!");
console.log("====================================");
Message.showColorized(Variant.Info, "Available actions");
console.log("\n");
console.log("list – show all users");
console.log("add – add new user to the list");
console.log("edit – edit user from the list");
console.log("remove – remove user from the list");
console.log("quit – quit the app");
console.log("\n");

enum Action {
    List = "list",
    Add = "add",
    Edit = "edit",
    Remove = "remove",
    Quit = "quit"
}

type InquirerAnswers = {
    action: Action
}

const startApp = () => {
    inquirer.prompt([{
        name: 'action',
        type: 'input',
        message: 'How can I help you?',
    }]).then(async (answers: InquirerAnswers) => {
        switch (answers.action) {
            case Action.List:
                users.showAll();
                break;
            case Action.Add:
                const user = await inquirer.prompt([{
                    name: 'name',
                    type: 'input',
                    message: 'Enter name',
                }, {
                    name: 'age',
                    type: 'number',
                    message: 'Enter age',
                }]);
                users.add(user);
                break;
            case Action.Edit:
                const usernameToEdit = await inquirer.prompt([{
                    name: 'name',
                    type: 'input',
                    message: 'Enter name of the user you want to edit:',
                }]);
                const userToEdit = users.data.find(user => user.name === usernameToEdit.name);
                if (userToEdit) {
                    const updatedUser = await inquirer.prompt([{
                        name: 'name',
                        type: 'input',
                        message: 'Enter new name:',
                        default: userToEdit.name
                    }, {
                        name: 'age',
                        type: 'number',
                        message: 'Enter new age:',
                        default: userToEdit.age
                    }]);
                    users.remove(usernameToEdit.name);
                    users.add(updatedUser);
                } else {
                    Message.showColorized(Variant.Error, "User not found")
                }
                break;
            case Action.Remove:
                const name = await inquirer.prompt([{
                    name: 'name',
                    type: 'input',
                    message: 'Enter name',
                }]);
                users.remove(name.name);
                break;
            case Action.Quit:
                Message.showColorized(Variant.Info, "Bye bye!");
                return;
            default:
                Message.showColorized(Variant.Error, "Command not found !");
                break;
        }

        startApp();
    });
}

startApp();