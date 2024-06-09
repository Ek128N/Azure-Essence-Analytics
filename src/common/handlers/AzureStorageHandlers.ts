import MethodDefinition, {Method} from "../../modules/MethodDefinition";
import {getDataServices} from "../azure/DataService";


export async function readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
    });
}

export function createMethodsFromDefinitions(methodDefinitions: MethodDefinition[]): Method[] {
    return methodDefinitions.map((methodDefinition, index) => {
        const methodName = generateMethodName(index + 1);
        return new Method(methodName, methodDefinition);
    });
}

export function generateMethodName(index: number): string {
    const date = new Date();
    return `Method ${index}: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

export async function getStoredData(key: string): Promise<Method[]> {
    try {
        const dataManager = await getDataServices();
        return await dataManager.getValue<Method[]>(key);
    } catch (error) {
        console.error("Error retrieving stored data:", error);
        throw error;
    }
}




