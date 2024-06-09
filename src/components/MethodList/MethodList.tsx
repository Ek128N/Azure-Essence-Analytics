// File: src/components/MethodList.tsx
import * as React from "react";
import { Header, TitleSize } from "azure-devops-ui/Header";
import { Table, SimpleTableCell } from "azure-devops-ui/Table";
import { ITableColumn } from "azure-devops-ui/Table";
import { ObservableArray, ObservableValue } from "azure-devops-ui/Core/Observable";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";

interface IMethod {
    methodName: string;
    description: string;
}

// Sample data for methods
const methods = new ObservableArray([
    new ObservableValue<IMethod>({ methodName: "Method 1", description: "Description of Method 1" }),
    new ObservableValue<IMethod>({ methodName: "Method 2", description: "Description of Method 2" }),
    new ObservableValue<IMethod>({ methodName: "Method 3", description: "Description of Method 3" })
]);

const columns: ITableColumn<IMethod>[] = [
    {
        id: "methodName",
        name: "Method Name",
        renderCell: (rowIndex, columnIndex, tableColumn, tableItem) => (
            <SimpleTableCell columnIndex={columnIndex} tableColumn={tableColumn} key={`col-${columnIndex}`}>
                {tableItem.methodName}
            </SimpleTableCell>
        ),
        width: 200,
    },
    {
        id: "description",
        name: "Description",
        renderCell: (rowIndex, columnIndex, tableColumn, tableItem) => (
            <SimpleTableCell columnIndex={columnIndex} tableColumn={tableColumn} key={`col-${columnIndex}`}>
                {tableItem.description}
            </SimpleTableCell>
        ),
        width: 300,
    },
];

const MethodList: React.FC = (): JSX.Element => {
    const [methodValues, setMethodValues] = React.useState<IMethod[]>([]);

    React.useEffect(() => {
        const updateMethods = () => {
            const updatedValues = methods.value.map(observableMethod => observableMethod.value);
            setMethodValues(updatedValues);
        };

        // Initial population
        updateMethods();

        // Subscribe to updates
        const subscription = methods.subscribe(updateMethods);

        // Cleanup function
        return () => {
            methods.unsubscribe(updateMethods);
        };
    }, []);

    const itemProvider = new ArrayItemProvider<IMethod>(methodValues);

    return (
        <div>
            <div className="flex-row">
                <Header
                    title="Methods"
                    titleSize={TitleSize.Medium}
                    className="margin-bottom-16"
                />
            </div>
        </div>
    );
}

export default MethodList;
