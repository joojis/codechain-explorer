import * as React from "react";
import * as _ from "lodash";

import { Col, Row } from 'reactstrap';

import "./TransactionDetails.scss"
import HexString from "../../util/HexString/HexString";
import { TransactionDoc, Type, AssetTransferTransactionDoc, AssetMintTransactionDoc } from "../../../db/DocType";
import { Script } from "codechain-sdk/lib/core/classes";
import { Buffer } from "buffer";

interface Props {
    transaction: TransactionDoc;
}

interface MetadataFormat {
    name?: string;
    description?: string;
    icon_url?: string;
}

const getMetadata = (data: string): MetadataFormat => {
    try {
        return JSON.parse(data);
    } catch (e) {
        // nothing
    }
    return {};
}

const getTransactionInfoByType = (transaction: TransactionDoc) => {
    if (Type.isAssetTransferTransactionDoc(transaction)) {
        const transactionDoc = transaction as AssetTransferTransactionDoc;
        return (
            <div>
                <Row>
                    <Col md="2">
                        Hash
                    </Col>
                    <Col md="10">
                        <HexString text={transactionDoc.data.hash} />
                    </Col>
                </Row>
                <Row>
                    <Col md="2">
                        NetworkID
                    </Col>
                    <Col md="10">
                        {transactionDoc.data.networkId}
                    </Col>
                </Row>
                <Row>
                    <Col md="2">
                        Nonce
                    </Col>
                    <Col md="10">
                        {transactionDoc.data.nonce}
                    </Col>
                </Row>
                <div className="line" />
                <Row>
                    <Col>
                        <h3>Input</h3>
                    </Col>
                </Row>
                {
                    _.map(transactionDoc.data.inputs, (input, index) => {
                        return <Row key={`transaction-header-table-input-${index}`}>
                            <Col className="asset-item">
                                <h4>Asset {index}</h4>
                                <div>
                                    <table className="inner-table">
                                        <tbody>
                                            <tr>
                                                <td>AssetType</td>
                                                <td><HexString link={`/asset/0x${input.prevOut.assetType}`} text={input.prevOut.assetType} /></td>
                                            </tr>
                                            <tr>
                                                <td>Amount</td>
                                                <td>{input.prevOut.amount}</td>
                                            </tr>
                                            <tr>
                                                <td>LockScript</td>
                                                <td>{_.map(new Script(input.lockScript).toTokens(), (token) => token.length > 10 ? token.slice(0, 10) + "..." : token).join(" ")}</td>
                                            </tr>
                                            <tr>
                                                <td>UnlockScript</td>
                                                <td>{_.map(new Script(input.unlockScript).toTokens(), (token) => token.length > 10 ? token.slice(0, 10) + "..." : token).join(" ")}</td>
                                            </tr>
                                            <tr>
                                                <td>Prev Tx</td>
                                                <td><HexString link={`/tx/0x${input.prevOut.transactionHash}`} text={input.prevOut.transactionHash} /></td>
                                            </tr>
                                            <tr>
                                                <td>Index</td>
                                                <td>{input.prevOut.index}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </Col>
                        </Row>
                    })
                }
                <div className="line" />
                <Row>
                    <Col>
                        <h3>Output</h3>
                    </Col>
                </Row>
                {
                    _.map(transactionDoc.data.outputs, (output, index) => {
                        return <Row key={`transaction-header-table-output-${index}`}>
                            <Col className="asset-item">
                                <h4>Asset {index}</h4>
                                <div>
                                    <table className="inner-table">
                                        <tbody>
                                            <tr>
                                                <td>AssetType</td>
                                                <td><HexString link={`/asset/0x${output.assetType}`} text={output.assetType} /></td>
                                            </tr>
                                            <tr>
                                                <td>Owner</td>
                                                <td>{
                                                    output.owner ? <HexString link={`/addr-asset/0x${output.owner}`} text={output.owner} /> : "Unknown"
                                                }</td>
                                            </tr>
                                            <tr>
                                                <td>Amount</td>
                                                <td>{output.amount}</td>
                                            </tr>
                                            <tr>
                                                <td>LockScriptHash</td>
                                                <td>{output.lockScriptHash === "f42a65ea518ba236c08b261c34af0521fa3cd1aa505e1c18980919cb8945f8f3" ? "P2PKH" : <HexString text={output.lockScriptHash} />}</td>
                                            </tr>
                                            <tr>
                                                <td>Parameters</td>
                                                <td>{_.map(output.parameters, (parameter, i) => {
                                                    return <div key={`transaction-paramter-${i}`}>{Buffer.from(parameter).toString("hex")}</div>
                                                })}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </Col>
                        </Row>
                    })
                }
            </div>
        );
    } else if (Type.isAssetMintTransactionDoc(transaction)) {
        const transactionDoc = transaction as AssetMintTransactionDoc;
        const metadata = getMetadata(transactionDoc.data.metadata);
        return (
            <div>
                <Row>
                    <Col md="2">
                        Hash
                    </Col>
                    <Col md="10">
                        <HexString text={transactionDoc.data.hash} />
                    </Col>
                </Row>
                <Row>
                    <Col md="2">
                        Registrar
                    </Col>
                    <Col md="10">
                        {transactionDoc.data.registrar ? <HexString link={`/addr-platform/0x${transactionDoc.data.registrar}`} text={transactionDoc.data.registrar} /> : "Not existed"}
                    </Col>
                </Row>
                <Row>
                    <Col md="2">
                        Nonce
                    </Col>
                    <Col md="10">
                        {transactionDoc.data.nonce}
                    </Col>
                </Row>
                <Row>
                    <Col md="2">
                        Owner
                    </Col>
                    <Col md="10">
                        {
                            transactionDoc.data.owner ? <HexString link={`/addr-asset/0x${transactionDoc.data.owner}`} text={transactionDoc.data.owner} /> : "Unknown"
                        }
                    </Col>
                </Row>
                <div className="line" />
                <Row>
                    <Col md="2">
                        AssetType
                    </Col>
                    <Col md="10">
                        <HexString link={`/asset/0x${transactionDoc.data.assetType}`} text={transactionDoc.data.assetType} />
                    </Col>
                </Row>
                <Row>
                    <Col md="2">
                        Amount
                    </Col>
                    <Col md="10">
                        {transactionDoc.data.amount}
                    </Col>
                </Row>
                <Row>
                    <Col md="2">
                        LockScriptHash
                    </Col>
                    <Col md="10">
                        {transactionDoc.data.lockScriptHash === "f42a65ea518ba236c08b261c34af0521fa3cd1aa505e1c18980919cb8945f8f3" ? "P2PKH" : <HexString text={transactionDoc.data.lockScriptHash} />}
                    </Col>
                </Row>
                <Row>
                    <Col md="2">
                        Parameters
                    </Col>
                    <Col md="10">
                        {_.map(transactionDoc.data.parameters, (parameter, i) => {
                            return <div key={`transaction-heder-param-${i}`}><HexString text={Buffer.from(parameter).toString("hex")} /></div>
                        })}
                    </Col>
                </Row>
                <Row>
                    <Col md="2">
                        Metadata
                    </Col>
                    <Col md="10">
                        <table className="inner-table">
                            <tbody>
                                <tr>
                                    <td>
                                        Name
                                        </td>
                                    <td>
                                        {metadata.name ? metadata.name : "Unknown"}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Description
                                        </td>
                                    <td>
                                        {metadata.description ? metadata.description : "Unknown"}
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Icon
                                        </td>
                                    <td>
                                        {metadata.icon_url ? <img className="asset-icon" src={metadata.icon_url} /> : "Unknown"}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Col>
                </Row>
            </div>
        );
    }
    return null;
}

const TransactionDetails = (props: Props) => {
    const { transaction } = props;

    return <div className="transaction-details">
        {
            getTransactionInfoByType(transaction)
        }
    </div>
};

export default TransactionDetails;
