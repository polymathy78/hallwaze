import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";





type EagerEntry = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Entry, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly code: string;
  readonly destination: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyEntry = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Entry, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly code: string;
  readonly destination: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Entry = LazyLoading extends LazyLoadingDisabled ? EagerEntry : LazyEntry

export declare const Entry: (new (init: ModelInit<Entry>) => Entry) & {
  copyOf(source: Entry, mutator: (draft: MutableModel<Entry>) => MutableModel<Entry> | void): Entry;
}