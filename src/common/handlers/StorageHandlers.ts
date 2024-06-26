import MethodDefinition, {Method} from "../../models/MethodDefinition";
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
        const methodName = `Method ${index + 1}`;
        const date = new Date().toDateString();
        return new Method(methodName, date, methodDefinition);
    });
}

export async function getStoredData(key: string): Promise<Method[]> {
    try {
        const dataManager = await getDataServices();
        const storedData = await dataManager.getValue<Method[]>(key);
        return storedData || [];
    } catch (error) {
        console.error("Error retrieving stored data:", error);
        return [];
    }
}

export async function addMethods(key: string, methods: Method[]): Promise<Method[]> {
    try {
        const dataManager = await getDataServices();
        const existingMethods = await dataManager.getValue<Method[]>(key) || [];
        const updatedMethods = [...existingMethods, ...methods];
        await dataManager.setValue(key, updatedMethods);
        return updatedMethods;
    } catch (error) {
        console.error("Error adding methods:", error);
        return methods;
    }
}

export async function deleteMethod(key: string, index: number, methods: Method[]): Promise<Method[]> {
    try {
        const dataManager = await getDataServices();
        const updatedMethods = [...methods];
        updatedMethods.splice(index, 1);
        await dataManager.setValue(key, updatedMethods);
        return updatedMethods;
    } catch (error) {
        console.error("Error deleting methods:", error);
        return methods;
    }
}