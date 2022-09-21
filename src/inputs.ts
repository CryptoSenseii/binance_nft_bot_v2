import prompts from 'prompts';

const inputSelectMode = async () => {
    const { value } = await prompts(
        {
            type: 'select',
            name: 'value',
            message: 'Select the mode',
            choices: [
                { title: 'Live sniper', value: 0 },
                { title: 'Last sales', value: 1 },
            ],
            initial: 0
        }
    );
    return value;
}

const inputSetConfig = async () => {
    const { uuid, csrf } = await prompts(
        [
            {
                type: 'text',
                name: 'uuid',
                message: 'Enter your uuid'
            },
            {
                type: 'text',
                name: 'csrf',
                message: 'Enter your csrf token'
            }
        ]);
    return { uuid, csrf };
}

const inputUseProxy = async () => {
    const { value } = await prompts(
        {
            type: 'select',
            name: 'value',
            message: 'Use proxy',
            choices: [
                { title: 'Yes', value: true },
                { title: 'No', value: false },
            ],
            initial: 0
        }
    );
    return value;
}

const inputProxyPath = async () => {
    const { value } = await prompts({
        type: 'text',
        name: 'value',
        message: 'Drag / Type the file with your proxies (*.txt)'
    });
    return value.replaceAll('"', '');
}

export { inputSelectMode, inputSetConfig, inputUseProxy, inputProxyPath }
