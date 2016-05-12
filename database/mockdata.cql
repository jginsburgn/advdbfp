    //Clean database:
match (n) detach delete n;

    //Mock data creation:
create (rp:RawProduct {name:"Egg", unit:"unit", kind:"basic", cost:"0.50"}),
    (rp)-[brpr1:BatchRPR]->(brp1:BatchRawProduct {amount:"5", expD:"05", expM:"10", expY:"2016"}),
    (rp)-[brpr2:BatchRPR]->(brp2:BatchRawProduct {amount:"10", expD:"15", expM:"02", expY:"2017"}),
    (rp2:RawProduct {name:"Flour", unit:"gram", kind:"carbohydrate", cost:"0.01"}),
    (rec:Recipe {name:"Cake"})-[ing:Ingredient {amount:"3"}]->(rp),
    (rec)-[ing2:Ingredient {amount:"500"}]->(rp2);
