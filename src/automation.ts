let automations: {[key: string]: rawAutomation};

export type rawStep = {
  type: string,
  path?: string,
  varRef?: string[],
  value?: string | number,
  id?: string,
  be_careful?: boolean
}

export type variables = {[key: string]: any}

export type rawAutomation = {
  steps: rawStep[],
  variables?: variables
}

export class step  {
  type: string
  path: string | null
  value: any
  id: string | null
  be_careful: boolean | null

  constructor(id: string | null, type: string, path: string | null, value: any, be_careful: boolean | null) {
    this.type = type;
    this.path = path;
    this.value = value;
    this.be_careful = be_careful;
    this.id = id;
  }
}

export type automation = step[]

function stringFormat(template: string, ...args: any[]) {
  return template.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] != 'undefined'
      ? args[number]
      : match
      ;
  });
}

function getVariableValues(v: variables, ref: string[]) : any[] {
  let a : any[] = [];

  if (ref === null || ref === undefined) {
    return [];
  }

  for (const r of ref) {
    a.push(v[r])
  }

  return a;
}

function isNumber(n: any) { return !isNaN(parseFloat(n)) && !isNaN(n - 0) }

export function parseAutomation(json: string) : automation {
  let rA: rawAutomation = JSON.parse(json);
  let a: automation = [];

  for (const rs of rA.steps) {
    switch (rs.type) {
      case 'goto': {
        let path = stringFormat(rs.path!, ...getVariableValues(rA.variables!, rs.varRef!));
        let s: step = new step(null, rs.type, path, null, null);
        a.push(s);
        break;
      }
      case 'state': {
        let value: any = null;
        if (isNumber(rs.value)) {
          value = rA.variables![rs.varRef![rs.value as number]];
        } else {
          value = stringFormat(rs.value as string, ...getVariableValues(rA.variables!, rs.varRef!));
        }
        let s: step = new step(rs.id!, rs.type, null, value, null);
        a.push(s);
        break;
      }
      case 'click': {
        let s: step = new step(rs.id!, rs.type, null, null, rs.be_careful!);
        a.push(s);
        break;
      }
      case 'delay': {
        let s: step = new step(null, rs.type, null, rs.value, null);
        a.push(s);
        break;
      }
    }
  }

  return a;
}

export function getAutomation(automationId: string, v: variables) : automation {
  let rA: rawAutomation = { ...automations[automationId], variables: v }

  let a: automation = [];

  for (const rs of rA.steps) {
    switch (rs.type) {
      case 'goto': {
        let path = stringFormat(rs.path!, ...getVariableValues(rA.variables!, rs.varRef!));
        let s: step = new step(null, rs.type, path, null, null);
        a.push(s);
        break;
      }
      case 'state': {
        let value: any = null;
        if (isNumber(rs.value)) {
          value = rA.variables![rs.varRef![rs.value as number]];
        } else {
          value = stringFormat(rs.value as string, ...getVariableValues(rA.variables!, rs.varRef!));
        }
        let s: step = new step(rs.id!, rs.type, null, value, null);
        a.push(s);
        break;
      }
      case 'delay': {
        let s: step = new step(null, rs.type, null, rs.value, null);
        a.push(s);
        break;
      }
      case 'click': {
        let s: step = new step(rs.id!, rs.type, null, null, rs.be_careful!);
        a.push(s);
        break;
      }
    }
  }

  return a;
}

export function setAutomations(autos: {[key: string]: rawAutomation}) {
  automations = autos;
}