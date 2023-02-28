const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "04b12bd1410b983d4d94998e400ec4c19e0bef0f983cbbea3310f6148c67d087b7132511c1474cf0f1a7149427b627be449a833d64824df750a9d70945aea3d9ba": 100,
  "0403628b6dce6a37f186b59a503d274f0aab55a7b13f39857c0c34d1759c4821750d61e6a3d0f1069b5b1b57135c688beb39906e941cede0df8e851c284277ae97": 50,
  "044c9b16e975b8a7e714d6367bae79bd248abee8428eeae6d170d6bed595910a647bac2ec57d85275d6fe0ff452b9b081417b74a1c6ea651ec2f8a14cd62ba73e5": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  // TODO: get a signature from the client-side app
  // recover the public address from the signature
  // ESE va a ser el sender (variable)

  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
