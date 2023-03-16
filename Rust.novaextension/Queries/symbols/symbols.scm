; STRUCTS
((struct_item 
    name: (type_identifier) @name) @subtree
(#set! role struct))

; Struct fields
((struct_item
    body: (field_declaration_list
        (field_declaration
            name: (field_identifier) @name) @subtree))
(#set! role property))

; ENUMS
((enum_item
    name: (type_identifier) @name) @subtree
(#set! role enum))

((enum_item
    body: (enum_variant_list
    (enum_variant
        name: (identifier) @name) @subtree))
(#set! role enum-member))

; Methods
((impl_item
    type: (type_identifier) @name
    !trait) @subtree @displayname.target
(#set! role category)
(#set! displayname.query "symbols/impl_item.scm"))

((impl_item
    trait: (_)) @name.target @displayname.target @subtree
(#set! role category)
(#set! name.query "symbols/impl_trait_name.scm")
(#set! displayname.query "symbols/impl_trait_display.scm"))

; ((impl_item
;     body: (declaration_list
;         (function_item
;             name: (identifier) @name) @subtree))
; (#set! role method))

; FUNCTIONS
((function_item
    name: (identifier) @name) @subtree
(#set! role function-or-method))
