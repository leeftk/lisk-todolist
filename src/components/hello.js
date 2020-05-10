import React, { Component } from 'react';
import {
    HelloTransaction,
} from '../transactions/index';
import { api } from '../api.js';
import * as cryptography from '@liskhq/lisk-cryptography';
import {utils} from "@liskhq/lisk-transactions";

const networkIdentifier = cryptography.getNetworkIdentifier(
    "23ce0366ef0a14a91e5fd4b1591fc880ffbef9d988ff8bebf8f3666b0c09597d",
    "Lisk",
);

class Hello extends Component {

    constructor(props) {
        super(props);

        this.state = {
            passphrase: '',
            response: { meta: { status: false }},
            transaction: {},
        };
    }

    handleChange = (event) => {
        let nam = event.target.name;
        console.log(nam)
        let val = event.target.value;
        console.log(val)
        this.setState({[nam]: val});
        console.log(this.state)
    };

    handleSubmit = (event) => {
        event.preventDefault();

        const helloTransaction = new HelloTransaction({
            asset: {
               ipfs: this.state.ipfs,

            },
            networkIdentifier: networkIdentifier,
            timestamp: utils.getTimeFromBlockchainEpoch(new Date()),
        });

        console.log(helloTransaction)

        helloTransaction.sign(this.state.passphrase);
        api.transactions.broadcast(helloTransaction.toJSON()).then(response => {
            this.setState({response:response});
            this.setState({transaction:helloTransaction});
        }).catch(err => {
            console.log(JSON.stringify(err, null, 2));
        });
    }

    render() {
        return (
            <div>
                <h2>Hello</h2>
                <p>Send a Hello transaction.</p>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Hello message:
                        <input type="text" id="ipfs" name="ipfs" onChange={this.handleChange} />
                    </label>
                    <label>
                        Passphrase:
                        <input type="text" id="passphrase" name="passphrase" onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                {this.state.response.meta.status &&
                <div>
                    <pre>Transaction: {JSON.stringify(this.state.transaction, null, 2)}</pre>
                    <p>Response: {JSON.stringify(this.state.response, null, 2)}</p>
                </div>
                }
            </div>
        );
    }
}
export default Hello;
