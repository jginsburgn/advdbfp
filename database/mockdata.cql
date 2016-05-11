    //Clean database:
match (n) detach delete n;

    //Mock data creation:
create (rp:RawProduct {name:"Egg", unit:"unit", kind:"basic", cost:"0.50"}),
    (rp)-[brpr:BatchRPR]->(brp:BatchRawProduct {amount:"5", expD:"05", expM:"10", expY:"2016"});
