# How to use this library

Use `AssistantProvider` to wrap your components in your App.tsx 

```tsx
<AssistantProvider>
    <Routes>
    ...
    </Routes>
</AssistantProvider>
```

In your home component use the setNavigationCallback to tell AssistantProvider how to navigate to a page

```tsx
const Home = (props: Props) => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigationCallback(path => {
      navigate(path);
    });
  }, [navigate]);

  ...
```

Based on your automations use the `useAssistedRef` and `useAssistedState`

For example:

consider you have automations:

```ts
export const automations : {[key: string]: automation} = {
  "create-project": {
    "steps": [
      {
        type: "goto",
        path: "/project"
      },
      {
        type: "state",
        id: "create-project-name",
        value: 0,
        varRef: [
          "name"
        ]
      },
      {
        type: "state",
        id: "create-project-descr",
        value: 0,
        varRef: [
          "descr"
        ]
      },
      {
        type: "state",
        id: "create-project-repo",
        value: 0,
        varRef: [
          "repo"
        ]
      },
      {
        type: "delay",
        value: 1000
      },
      {
        type: "click",
        id: "create-project",
        be_careful: true
      }
    ],
  }
```

An automation step of type `state` has to be attached to your state in your component of choice like this:

```ts
...

const [name, setName] = useAssistedState("create-project-name", "");

...

return (
    ...

    <InputWithValidation
        label='Project name'
        placeholder='name of your project'
        value={name}
    />

    ...
);
```

An automation step of type `click` has to be attached using a ref like this:

```ts
...

const ref = useAssistedRef("create-project");

...

return (
    ...

    <button onClick={() => setIsOpen(true)} className='btn' ref={ref}>
        Create Project
    </button>

    ...
)
```