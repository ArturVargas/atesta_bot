import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { getSignerFor } from '../wallet';
import { Chains } from "../wallet/chains";

const EAS_ADDRESS = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0";
const SCHEMA_UID = "0x327ff96e3e610b2c0d090a3a8d2b995644461930ca1ab54431222e2fd09bbaa9";

const schemaEncoder = new SchemaEncoder("string DAO_name,bytes32 ticket_ref,bool is_payed,string event_name");
// const encodedData = schemaEncoder.encodeData([
// 	{ name: "DAO_name", value: "frutero_club", type: "string" },
// 	{ name: "ticket_ref", value: "0x746869732069732e20746865207469636b6574207265666572656e6365000000", type: "bytes32" },
// 	{ name: "is_payed", value: false, type: "bool" },
// 	{ name: "event_name", value: "ethcdm", type: "string" }
// ]);

interface ISchemaItem {
	name: string,
	value: any,
	type: string
}

interface ISchema {
	daoName: string,
	ticketRef: string, //?
	isPayed: boolean,
	eventName: string
}

/**
	* Facade for the EAS 
*/
export class Attester {
	eas: EAS;
	private schemaUID: string;

	constructor(chain: Chains) {
		const signer = getSignerFor(chain)
		this.eas = new EAS(EAS_ADDRESS).connect(signer);
		this.schemaUID = SCHEMA_UID;
	}

	/**
		* Creates a new attestation
		* @param data - An array of values compliant with our schema (ISchemaItem)
		* @returns the new attestation uid
	*/
	async createAttestation(data: ISchemaItem[]) {
		const _encodedData = schemaEncoder.encodeData(data)

		const tx = await this.eas.attest({
			schema: this.schemaUID,
			data: {
				recipient: "0x0000000000000000000000000000000000000000",
				expirationTime: BigInt(0),
				revocable: false, // Be aware that if your schema is not revocable, this MUST be false
				data: _encodedData,
			},
		});
		const newAttestationUID = await tx.wait();
		console.log("New attestation UID:", newAttestationUID);
		return newAttestationUID;
	}
}
