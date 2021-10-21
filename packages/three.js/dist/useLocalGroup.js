import { Group } from "three";
import { provide } from "vue";
import { useLocalObject } from "./useLocalObject";
export function useLocalGroup(providedName = "root") {
    const root = new Group();
    provide(providedName, root);
    useLocalObject(root);
    return root;
}
