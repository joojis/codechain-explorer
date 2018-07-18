import * as React from "react";
import * as _ from "lodash";

import { Row, Col } from "reactstrap";

import "./ParcelTransactionList.scss"
import HexString from "../../util/HexString/HexString";

import * as arrow from "./img/arrow.png";
import { TransactionDoc, Type, AssetMintTransactionDoc, AssetTransferTransactionDoc } from "../../../db/DocType";

interface Props {
    transactions: TransactionDoc[];
}
const TransactionObjectByType = (transaction: TransactionDoc) => {
    if (Type.isAssetMintTransactionDoc(transaction)) {
        const transactionDoc = transaction as AssetMintTransactionDoc;
        return (
            <Row>
                <Col>
                    <div className="background-highlight">
                        <Row className="inner-row">
                            <Col md="2">
                                AssetType
                            </Col>
                            <Col md="10">
                                <HexString link={`/asset/0x${transactionDoc.data.assetType}`} text={transactionDoc.data.assetType} />
                            </Col>
                        </Row>
                        <Row className="inner-row">
                            <Col md="2">
                                Registarar
                            </Col>
                            <Col md="10">
                                {
                                    transactionDoc.data.registrar ?
                                        <HexString link={`/addr-platform/0x${transactionDoc.data.registrar}`} text={transactionDoc.data.registrar} />
                                        : "Unknown"
                                }
                            </Col>
                        </Row>
                        <Row className="inner-row">
                            <Col md="2">
                                Owner
                            </Col>
                            <Col md="10">
                                {
                                    transactionDoc.data.owner ?
                                        <HexString link={`/addr-asset/0x${transactionDoc.data.owner}`} text={transactionDoc.data.owner} />
                                        : "Unknown"
                                }
                            </Col>
                        </Row>
                        <Row className="inner-row">
                            <Col md="2">
                                Amount
                            </Col>
                            <Col md="10">
                                {transactionDoc.data.amount}
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        )
    } else if (Type.isAssetTransferTransactionDoc(transaction)) {
        const transactionDoc = transaction as AssetTransferTransactionDoc;
        return (
            <Row>
                <Col>
                    <div>
                        <Row>
                            <Col md="5">
                                {
                                    _.map(transactionDoc.data.inputs, (input, i) => {
                                        return (
                                            <div key={`input-${i}`} className="background-highlight mb-3">
                                                <Row className="inner-row">
                                                    <Col><HexString link={`/asset/0x${input.prevOut.assetType}`} text={input.prevOut.assetType} length={40} /></Col>
                                                </Row>
                                                <Row className="inner-row">
                                                    <Col md="4">
                                                        Owner
                                                    </Col>
                                                    <Col md="8">
                                                        {input.prevOut.owner}
                                                    </Col>
                                                </Row>
                                                <Row className="inner-row">
                                                    <Col md="4">
                                                        Amount
                                                    </Col>
                                                    <Col md="8">
                                                        {input.prevOut.amount}
                                                    </Col>
                                                </Row>
                                            </div>
                                        )
                                    })
                                }
                            </Col>
                            <Col md="2" className="text-center">
                                <img src={arrow} alt="Arrow" className="mt-5" />
                            </Col>
                            <Col md="5">
                                {
                                    _.map(transactionDoc.data.outputs, (output, i) => {
                                        return (
                                            <div key={`output-${i}`} className="background-highlight mb-3">
                                                <Row className="inner-row">
                                                    <Col><HexString link={`/asset/0x${output.assetType}`} text={output.assetType} length={40} /></Col>
                                                </Row>
                                                <Row className="inner-row">
                                                    <Col md="4">
                                                        Owner
                                                    </Col>
                                                    <Col md="8">
                                                        {
                                                            output.owner ?
                                                                <HexString link={`/addr-asset/0x${output.owner}`} text={output.owner} length={10} />
                                                                : "Unknown"
                                                        }
                                                    </Col>
                                                </Row>
                                                <Row className="inner-row">
                                                    <Col md="4">
                                                        Amount
                                                    </Col>
                                                    <Col md="8">
                                                        {output.amount}
                                                    </Col>
                                                </Row>
                                            </div>
                                        )
                                    })
                                }
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        )
    }
    return null;
}

const getClassNameByType = (type: string) => {
    if (type === "assetMint") {
        return "asset-mint-type";
    } else if (type === "assetTransfer") {
        return "asset-transfer-type";
    }
    return null;
}

const ParcelTransactionList = (props: Props) => {
    const { transactions } = props;
    return <div className="parcel-transaction-list">{transactions.map((transaction, i: number) => {
        const hash = transaction.data.hash;
        return <div key={`parcel-transaction-${hash}`} className="transaction-item">
            <div className={`type ${getClassNameByType(transaction.type)}`}>
                {transaction.type}
            </div>
            <Row>
                <Col md="2">
                    Transaction
            </Col>
                <Col md="10">
                    <HexString link={`/tx/0x${hash}`} text={hash} />
                </Col>
            </Row>
            {TransactionObjectByType(transaction)}
        </div>
    })}</div>
};

export default ParcelTransactionList;
