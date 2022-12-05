export const useEnter = (run: Function, event) => {
    if (event.key == 'Enter') {
        run();
    }
}