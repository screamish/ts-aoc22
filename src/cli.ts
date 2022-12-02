#!/usr/bin/env node

import { createCommand } from 'commander'

import { orderPizza } from './index'
 
const program = createCommand()
  .version('0.1.0')
  .option('-p, --peppers', 'Add peppers')
  .option('-P, --pineapple', 'Add pineapple')
  .option('-b, --bbq-sauce', 'Add bbq sauce')
  .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
  .action(async (env: any) => {
    orderPizza({
      peppers: env.peppers,
      pineapple: env.pineapple,
      bbqSauce: env.bbqSauce,
      cheeseType: env.cheese
    }).then(result => console.log(result.message))
  });

program.parse(process.argv)

