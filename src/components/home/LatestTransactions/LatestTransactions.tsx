import * as _ from "lodash";
import * as moment from "moment";
import * as React from "react";

import { TransactionDoc } from "codechain-indexer-types";
import { Link } from "react-router-dom";
import { getTotalAssetCount } from "../../../utils/Asset";
import DataTable from "../../util/DataTable/DataTable";
import HexString from "../../util/HexString/HexString";
import { ImageLoader } from "../../util/ImageLoader/ImageLoader";
import { TypeBadge } from "../../util/TypeBadge/TypeBadge";
import "./LatestTransactions.scss";

interface Props {
    transactions: TransactionDoc[];
}

function getAssetInfo(transaction: TransactionDoc) {
    let assetType = "";
    if (transaction.type === "mintAsset") {
        assetType = transaction.mintAsset.assetType;
    } else if (transaction.type === "transferAsset") {
        if (transaction.transferAsset.inputs.length > 0) {
            assetType = transaction.transferAsset.inputs[0].prevOut.assetType;
        } else if (transaction.transferAsset.burns.length > 0) {
            assetType = transaction.transferAsset.burns[0].prevOut.assetType;
        }
    } else if (transaction.type === "composeAsset") {
        assetType = transaction.composeAsset.assetType;
    } else if (transaction.type === "decomposeAsset") {
        assetType = transaction.decomposeAsset.input.prevOut.assetType;
    }
    return (
        <span>
            <ImageLoader className="mr-2" data={assetType} size={18} isAssetImage={true} />
            <HexString link={`/asset/0x${assetType}`} text={assetType} />
        </span>
    );
}

const LatestTransactions = (props: Props) => {
    const { transactions } = props;
    return (
        <div className="latest-transactions">
            <h1>Latest Transactions</h1>
            <div className="latest-container">
                <DataTable>
                    <thead>
                        <tr>
                            <th style={{ width: "20%" }}>Type</th>
                            <th style={{ width: "20%" }}>Hash</th>
                            <th style={{ width: "25%" }}>Assets</th>
                            <th style={{ width: "15%" }}>Quantity</th>
                            <th style={{ width: "20%" }}>Last seen</th>
                        </tr>
                    </thead>
                    <tbody>
                        {_.map(transactions.slice(0, 10), (transaction: TransactionDoc) => {
                            return (
                                <tr key={`home-transaction-hash-${transaction.hash}`} className="animated fadeIn">
                                    <td>
                                        <TypeBadge transaction={transaction} />{" "}
                                    </td>
                                    <td scope="row">
                                        <HexString link={`/tx/0x${transaction.hash}`} text={transaction.hash} />
                                    </td>
                                    <td>{getAssetInfo(transaction)}</td>
                                    <td>{getTotalAssetCount(transaction).toLocaleString()}</td>
                                    <td>{moment.unix(transaction.timestamp!).fromNow()}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </DataTable>
                {
                    <div className="mt-small">
                        <Link to={"/txs"}>
                            <button type="button" className="btn btn-primary w-100">
                                <span>View all transactions</span>
                            </button>
                        </Link>
                    </div>
                }
            </div>
        </div>
    );
};

export default LatestTransactions;
