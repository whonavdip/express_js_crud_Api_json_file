const port= 3000;
const express = require('express');
const app = require('express')();
const { constants } = require('buffer');
const fs = require('fs');
const { count } = require('console');
var bodyParser = require('body-parser')
app.use(bodyParser.json());
let name = JSON.parse(fs.readFileSync('./data/name.json'));
const jsonFilePath = './data/name.json';


app.listen(port,()=>
    console.log(`Server Is Running On ${port}`)
);

//post(insert data in json file)
app.post('/name',(req,res)=>{
        console.log(req.body);
        const newID = name[name.length-1].id +1;
        const newName = Object.assign({id:newID}, req.body)
        name.push(newName);
        fs.writeFile('./data/name.json', JSON.stringify(name),()=>{
            res.status(201).json({
                status: "Sucess",
                data: {
                    name: newName
                }
            })
        })
       // res.send('Created');
})

//get method(get all data)
app.get('/name',(req,res)=>{
    res.status(200).json({
        status: "Get Sucess",
        count : name.length,
        data : {
            name : name
        }
    })
});

//get method by id(data fetch from ID)
app.get('/name/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile('./data/name.json', 'utf8', (err, data) => {
        
        const jsonData = JSON.parse(data);

        const item = jsonData.find(item => item.id === parseInt(id));
        if (!item) {
          res.status(404).json({ error: 'Item not found' });
        } else {
          res.json(item);
        }
    });
});

//put method (UPDATE)
// PUT request to update data in JSON file(update krne k liye by ID)
app.put('/name/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedData = req.body;
    const existingData = readDataFromFile();
    const index = existingData.findIndex(item => item.id === id);
    if (index !== -1) {
        const item  = existingData.find(item => item.id === parseInt(id));
        const oid=item.id;
        const oname=item.name;
        const orollno=item.rollno;
        updatedData.id=id;
        updatedData.name=updatedData.name || oname;
        updatedData.rollno=updatedData.rollno|| orollno;
        existingData[index] = updatedData;
        writeDataToFile(existingData);
        res.json({ message: 'Data updated successfully', updatedData });
    } else {
        res.status(404).json({ error: 'Data not found' });
    }
});

//function to read data from json file(json file to read krne k liye function)
const readDataFromFile = () => {
    try {
        const data = fs.readFileSync(jsonFilePath);
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data from file:', error);
        return [];
    }
};

// Function to write data to JSON file(json file ko write krne k liye function)
const writeDataToFile = (data) => {
    try {
        fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 4));
    } catch (error) {
        console.error('Error writing data to file:', error);
    }
};



//delete the data from json file (Delete krne k liye json file se)
app.delete('/name/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let existingData = readDataFromFile();
    const newData = existingData.filter(item => item.id !== id);
    if (existingData.length !== newData.length) {
        writeDataToFile(newData);
        res.json({ message: 'Data deleted successfully' });
    } else {
        res.status(404).json({ error: 'Data not found' });
    }
});

