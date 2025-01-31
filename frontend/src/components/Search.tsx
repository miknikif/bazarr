import { useServerSearch } from "@/apis/hooks";
import { useDebouncedValue } from "@/utilities";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Anchor,
  Autocomplete,
  createStyles,
  SelectItemProps,
} from "@mantine/core";
import { forwardRef, FunctionComponent, useMemo, useState } from "react";
import { Link } from "react-router-dom";

type SearchResultItem = {
  value: string;
  link: string;
};

function useSearch(query: string) {
  const debouncedQuery = useDebouncedValue(query, 500);
  const { data } = useServerSearch(debouncedQuery, debouncedQuery.length > 0);

  return useMemo<SearchResultItem[]>(
    () =>
      data?.map((v) => {
        let link: string;
        if (v.sonarrSeriesId) {
          link = `/series/${v.sonarrSeriesId}`;
        } else if (v.radarrId) {
          link = `/movies/${v.radarrId}`;
        } else {
          throw new Error("Unknown search result");
        }

        return {
          value: `${v.title} (${v.year})`,
          link,
        };
      }) ?? [],
    [data]
  );
}

const useStyles = createStyles((theme) => {
  return {
    result: {
      color:
        theme.colorScheme === "light"
          ? theme.colors.dark[8]
          : theme.colors.gray[1],
    },
  };
});

type ResultCompProps = SelectItemProps & SearchResultItem;

const ResultComponent = forwardRef<HTMLDivElement, ResultCompProps>(
  ({ link, value }, ref) => {
    const styles = useStyles();

    return (
      <Anchor
        component={Link}
        to={link}
        underline={false}
        className={styles.classes.result}
        p="sm"
      >
        {value}
      </Anchor>
    );
  }
);

const Search: FunctionComponent = () => {
  const [query, setQuery] = useState("");

  const results = useSearch(query);

  return (
    <Autocomplete
      icon={<FontAwesomeIcon icon={faSearch} />}
      itemComponent={ResultComponent}
      placeholder="Search"
      size="sm"
      data={results}
      value={query}
      onChange={setQuery}
      onBlur={() => setQuery("")}
    ></Autocomplete>
  );
};

export default Search;
