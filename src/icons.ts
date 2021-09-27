import type { IconDefinition } from "@fortawesome/fontawesome-common-types"
import { library } from "@fortawesome/fontawesome-svg-core"
import { faTimer } from "@fortawesome/pro-thin-svg-icons/faTimer"
import { faMagnifyingGlassPlus } from "@fortawesome/pro-regular-svg-icons/faMagnifyingGlassPlus"
import { faMagnifyingGlassMinus } from "@fortawesome/pro-regular-svg-icons/faMagnifyingGlassMinus"
import { faTvRetro } from "@fortawesome/pro-solid-svg-icons/faTvRetro"
import { faTvAlt } from "@fortawesome/pro-regular-svg-icons/faTvAlt"

library.add(faTimer)
library.add(faMagnifyingGlassPlus as IconDefinition)
library.add(faMagnifyingGlassMinus as IconDefinition)
library.add(faTvRetro as IconDefinition)
library.add(faTvAlt as IconDefinition)
