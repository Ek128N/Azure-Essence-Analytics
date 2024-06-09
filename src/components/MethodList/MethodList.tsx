import * as React from "react";
import { Table, SimpleTableCell } from "azure-devops-ui/Table";
import { ITableColumn } from "azure-devops-ui/Table";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import { Card } from "azure-devops-ui/Card";
import { Button } from "azure-devops-ui/Button";
import { Method } from "../../modules/MethodDefinition";

interface MethodListProps {
    methods: Method[];
    onDeleteMethod: (index: number) => Promise<void>;
}

export default function MethodList({ methods, onDeleteMethod }: MethodListProps): JSX.Element {
    const columns: ITableColumn<Method>[] = [
        {
            id: "methodName",
            name: "Method",
            renderCell: renderSimpleCell,
            width: -100
        },
        {
            id: "date",
            name: "Created at",
            renderCell: renderDateCell,
            width: -250
        },
        {
            id: "actions",
            renderCell: renderActionCell,
            width: -50
        }
    ];

    function renderSimpleCell(rowIndex: number, columnIndex: number, tableColumn: ITableColumn<Method>, tableItem: Method): JSX.Element {
        return <SimpleTableCell key={tableItem.methodName + "name"} columnIndex={columnIndex} tableColumn={tableColumn}>{tableItem.methodName}</SimpleTableCell>;
    }

    function renderDateCell(rowIndex: number, columnIndex: number, tableColumn: ITableColumn<Method>, tableItem: Method): JSX.Element {
        return <SimpleTableCell key={tableItem.methodName + "date"} columnIndex={columnIndex} tableColumn={tableColumn}>{tableItem.date}</SimpleTableCell>;
    }

    function renderActionCell(rowIndex: number, columnIndex: number, tableColumn: ITableColumn<Method>, tableItem: Method): JSX.Element {
        return (
            <SimpleTableCell key={tableItem.methodName + "action"} columnIndex={columnIndex} tableColumn={tableColumn}>
                <Button
                    text="Delete"
                    onClick={() => onDeleteMethod(rowIndex)}
                />
            </SimpleTableCell>
        );
    }

    return (
        <Card
            className="flex-grow bolt-table-card"
            contentProps={{ contentPadding: false }}
            titleProps={{ text: "Essence Methods" }}
        >
            <Table<Method>
                columns={columns}
                itemProvider={new ArrayItemProvider(methods)}
            />
        </Card>
    );
}
