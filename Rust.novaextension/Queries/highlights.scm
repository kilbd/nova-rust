; Identifier conventions

; Assume all-caps names are constants
((identifier) @identifier.constant
 (#match? @identifier.constant "^[A-Z][A-Z\\d_]+$'"))

; Assume that uppercase names in paths are types
((scoped_identifier
  path: (identifier) @identifier.type)
 (#match? @identifier.type "^[A-Z]"))
((scoped_identifier
  path: (scoped_identifier
    name: (identifier) @identifier.type))
 (#match? @identifier.type "^[A-Z]"))
((scoped_type_identifier
  path: (identifier) @identifier.type)
 (#match? @identifier.type "^[A-Z]"))
((scoped_type_identifier
  path: (scoped_identifier
    name: (identifier) @identifier.type))
 (#match? @identifier.type "^[A-Z]"))

; Assume other uppercase names are enum constructors
((identifier) @identifier.type.enum
 (#match? @identifier.type.enum "^[A-Z]"))

; Assume all qualified names in struct patterns are enum constructors. (They're
; either that, or struct names; highlighting both as constructors seems to be
; the less glaring choice of error, visually.)
(struct_pattern
  type: (scoped_type_identifier
    name: (type_identifier) @identifier.type.enum))

; Function calls

(call_expression
  function: (identifier) @identifier.function
  ; Identifiers starting with capital letters are likely enum constructors
  (#not-match? @identifier.function "^[A-Z]"))
(call_expression
  function: (field_expression
    field: (field_identifier) @identifier.method))
(call_expression
  function: (scoped_identifier
    "::"
    name: (identifier) @identifier.function)
    ; Identifiers starting with capital letters are likely enum constructors
    (#not-match? @identifier.function "^[A-Z]"))

(generic_function
  function: (identifier) @identifier.function)
(generic_function
  function: (scoped_identifier
    name: (identifier) @identifier.function))
(generic_function
  function: (field_expression
    field: (field_identifier) @identifier.method))

(macro_invocation
  macro: (identifier) @identifier.function.macro.markup.bold
  "!" @identifier.function.macro.markup.bold)

; Function definitions

(function_item (identifier) @definition.function)
(function_signature_item (identifier) @function)

; Other identifiers

(type_identifier) @identifier.type
(primitive_type) @identifier.core.type.builtin
(field_identifier) @identifier.property

((line_comment) @comment.doc.string 
  (#match? @comment.doc.string "^//[/!]"))
(line_comment) @comment
(block_comment) @comment

"(" @punctuation.bracket
")" @punctuation.bracket
"[" @punctuation.bracket
"]" @punctuation.bracket
"{" @punctuation.bracket
"}" @punctuation.bracket

(type_arguments
  "<" @punctuation.bracket
  ">" @punctuation.bracket)
(type_parameters
  "<" @punctuation.bracket
  ">" @punctuation.bracket)

"::" @punctuation.delimiter
":" @punctuation.delimiter
"." @punctuation.delimiter
"," @punctuation.delimiter
";" @punctuation.delimiter

(parameter (identifier) @identifier.argument)

(lifetime (identifier) @identifier.decorator.lifetime)

"as" @keyword
"async" @keyword.modifier
"await" @keyword
"break" @keyword
"const" @keyword
"continue" @keyword
"default" @keyword
"dyn" @keyword
"else" @keyword
"enum" @keyword
"extern" @keyword
"fn" @keyword
"for" @keyword
"if" @keyword
"impl" @keyword
"in" @keyword
"let" @keyword
"loop" @keyword
"macro_rules!" @keyword
"match" @keyword
"mod" @keyword
"move" @keyword
"pub" @keyword.modifier
"ref" @keyword
"return" @keyword
"static" @keyword
"struct" @keyword
"trait" @keyword
"type" @keyword
"union" @keyword
"unsafe" @keyword
"use" @keyword
"where" @keyword
"while" @keyword
(crate) @keyword
(mutable_specifier) @keyword.modifier
(use_list (self) @keyword)
(scoped_use_list (self) @keyword)
(scoped_identifier (self) @keyword.self)
(super) @keyword

(self) @keyword.self

(char_literal) @string
(string_literal) @string
(raw_string_literal) @string

(boolean_literal) @value.boolean
(integer_literal) @value.number
(float_literal) @value.number

(escape_sequence) @string.escape

(attribute_item) @processing.attribute
(attribute
  arguments: (token_tree (string_literal) @processing.attribute))
(inner_attribute_item) @processing.attribute

"*" @operator
"&" @operator
"'" @operator
"?" @operator
