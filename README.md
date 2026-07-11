# Sand, A Markup Language
<sub>Prealpha 0.0.1</sub>

---

**Sand** is the Markup Language coming with the Gravel series. Sand provides a basic environment to write basic articles or websites.

## The Logic

Sand's logic is simple. Every line, can start with **three** characters, every one with a specific meaning.

| Character | Meaning  |
|-----------|----------|
| -         | A node   |
| /         | Attribute|
| .         | Literal  |

Nodes can be nested using indentation. A nested attribute will be used when creating the HTML element. Attributes are defines in `/key=value`. Literals will be added soon, and will be useful specially for lists, but every node handles attributes and literals it's own way.

For literal blocks, In the future this will be available:
```
...
    I am a block
    Same thing
    We are all together
...

```

### After name value

Some nodes accpet a value after its name (`-H1: ANV`). Every node uses it as described in the next chapter.

## Available Nodes and attributes

* **CONTENT**: Main container for your code
  * Id
* **H1-H6**: Headers
  * Id
  * ANV: Text
* **TXT**: Paragraph
  * Id
  * ANV: Text


## Example

### Sand: 

```
-CONTENT:
    -H1: Sand, a Markup Language
        /id=TITLE
    -H2: Why Sand?
    -H4: Because Sand is
    -TXT: - Structured as HTML
    -TXT: - Readable as MD
    -TXT: - Easy to write as YAML
    -H3: IMPORTANT: Sand has just been started being developed!
```

### Result:

<div><h1 id="TITLE">Sand, a Markup Language</h1>
<h2>Why Sand?</h2>
<h4>Because Sand is</h4>
<p>- Structured as HTML</p>
<p>- Readable as MD</p>
<p>- Easy to write as YAML</p>
<h3>IMPORTANT: Sand has just been started being developed!</h3>
</div>

## Changelog
**2026-7-11**:
- First Commit:
  - Nodes: H1-H6, TXT, CONTENT
  - Basic Transpilation and Documentation
