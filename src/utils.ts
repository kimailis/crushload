export interface CiscoDeviceState {
  hostname: string;
  mode: 'user' | 'privileged' | 'global-config';
}

export function getInitialCiscoState(deviceName: string): CiscoDeviceState {
  return {
    hostname: deviceName,
    mode: 'user',
  };
}

export function parseCiscoCommand(input: string, state: CiscoDeviceState): { newState: CiscoDeviceState, output?: string } {
  const trimmed = input.trim().toLowerCase();
  let newState = { ...state };
  let output = '';

  if (trimmed === 'enable' && state.mode === 'user') {
    newState.mode = 'privileged';
    return { newState };
  }

  if (trimmed === 'configure terminal' && state.mode === 'privileged') {
    newState.mode = 'global-config';
    return { newState };
  }

  if (trimmed === 'exit') {
    if (state.mode === 'global-config') {
      newState.mode = 'privileged';
      output = '%SYS-5-CONFIG_I: Configured from console by console';
    } else if (state.mode === 'privileged') {
      newState.mode = 'user';
    }
    return { newState, output };
  }

  if (trimmed === 'show running-config' && state.mode === 'privileged') {
    output = `Building configuration...\n\nCurrent configuration : 1542 bytes\n!\nversion 15.2\nhostname ${state.hostname}\n!\ninterface GigabitEthernet0/0\n ip address 192.168.1.1 255.255.255.0\n duplex auto\n speed auto\n!\nline con 0\nline vty 0 4\n login\n!\nend`;
  } else if (trimmed === 'show ip interface brief' && (state.mode === 'privileged' || state.mode === 'user')) {
    output = `Interface              IP-Address      OK? Method Status                Protocol\nGigabitEthernet0/0     192.168.1.1     YES NVRAM  up                    up\nGigabitEthernet0/1     unassigned      YES NVRAM  administratively down down`;
  } else if (trimmed.startsWith('hostname ') && state.mode === 'global-config') {
    const parts = input.split(' ');
    if (parts.length > 1) {
      newState.hostname = parts[1];
    }
  } else {
    output = '% Invalid input detected at \'^\' marker.';
  }

  return { newState, output };
}
