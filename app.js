const program = require('commander');
const { prompt } = require('inquirer');
const {
  getAccountList,
  getAccount,
  addAccount,
  updateAccount,
  deleteAccount
} = require('./api');

const questions = [
  {
    type: 'input',
    name: 'name',
    message: 'Account name: '
  },
  {
    type: 'input',
    name: 'username',
    message: 'Username or email: '
  },
  {
    type: 'input',
    name: 'password',
    message: 'Account password: '
  },
  {
    type: 'input',
    name: 'confirmpassword',
    message: 'Confirm password: '
  },
  {
    type: 'input',
    name: 'masterpassword',
    message: 'Enter master password: '
  }
];

program
  .command('getAccountList')
  .alias('l')
  .description('List accounts')
  .action(() => getAccountList());

program
  .command('getAccount <name> <mp>')
  .alias('r')
  .description('Get account')
  .action((name, mp) => getAccount(name, mp));

program
  .command('addAccount')
  .alias('a')
  .description('Add an account')
  .action(() => {
    prompt(questions).then(answers => {
      if (answers.password === answers.confirmpassword) {
        addAccount(answers);
      } else {
        console.log(`Passwords don't match.`);
      }
    });
  });

program 
  .command('updateAccount <_id>')
  .alias('u')
  .description('Update account')
  .action(_id => {
    prompt(questions).then(answers => {
      if (answers.password === answers.confirmpassword) {
        updateAccount(_id, answers);
      } else {
        console.log(`Passwords don't match.`);
      }
    });
  });

program
  .command('deleteAccount <_id>')
  .alias('d')
  .description('Delete account')
  .action(_id => deleteAccount(_id));
 
program.parse(process.argv);
