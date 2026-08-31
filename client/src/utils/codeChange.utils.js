export const isValidCodeChange = ({
    originalCode,
    proposedCode,
}) => {
    if (!proposedCode?.trim()) {
        return false;
    }

    if (!originalCode?.trim()) {
        return false;
    }

    // Skip the preview when the generated file is unchanged.
    if (originalCode.trim() === proposedCode.trim()) {
        return false;
    }

    return true;
};