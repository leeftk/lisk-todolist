const {
    BaseTransaction,
    TransactionError
} = require('@liskhq/lisk-transactions');

class HelloTransaction extends BaseTransaction {

	static get TYPE () {
		return 20;
	};

	static get FEE () {
		return `${10 ** 8}`;
	};

	async prepare(store) {
		await store.account.cache([
			{
				address: this.senderId,
			},
		]);
	}

	validateAsset() {
		const errors = [];
		if (!this.asset.ipfs|| typeof this.asset.ipfs !== 'string' || this.asset.ipfs.length > 64) {
			errors.push(
				new TransactionError(
					'Invalid "asset.hello" defined on transaction',
					this.id,
					'.asset.hello',
					this.asset.ipfs,
					'A string value no longer than 64 characters',
				)
			);
		}
		return errors;
	}

	applyAsset(store) {
        const errors = [];
        const sender = store.account.get(this.senderId);
        if (sender.asset && sender.asset.ipfs) {
            errors.push(
                new TransactionError(
                    'You cannot send a hello transaction multiple times',
	                sender.asset.ipfs,
                    '.asset.hello',
                    this.asset.ipfs
                )
            );
        } else {
            const newObj = { ...sender, asset: { ipfs: this.asset.ipfs}  };
            store.account.set(sender.address, newObj);
        }
        return errors; // array of TransactionErrors, returns empty array if no errors are thrown
	}

	undoAsset(store) {
		const sender = store.account.get(this.senderId);
		const oldObj = { ...sender, asset: null };
		store.account.set(sender.address, oldObj);
		return [];
	}
}

module.exports = HelloTransaction;